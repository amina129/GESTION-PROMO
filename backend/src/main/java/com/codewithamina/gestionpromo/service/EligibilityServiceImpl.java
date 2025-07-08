package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.EligibilityResult;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EligibilityServiceImpl implements EligibilityService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Récupère les promotions automatiques éligibles pour un client
     * Cette méthode est utilisée pour l'attribution automatique des promotions
     */
    @Override
    public List<Promotion> getEligiblePromotions(Client client) {
        String jpql = "SELECT p FROM Promotion p WHERE p.active = true " +
                "AND p.statut = 'ACTIVE' " +
                "AND p.estAutomatique = true " + // Seulement les promos automatiques
                "AND CURRENT_TIMESTAMP BETWEEN p.dateDebut AND p.dateFin";

        TypedQuery<Promotion> query = entityManager.createQuery(jpql, Promotion.class);
        List<Promotion> promotions = query.getResultList();

        return promotions.stream()
                .filter(p -> isEligibleForBasicCriteria(client, p))
                .collect(Collectors.toList());
    }

    /**
     * Vérifie si un client est éligible à une promotion (automatique ou manuelle)
     * Cette méthode vérifie uniquement les critères d'éligibilité, pas le type d'activation
     */
    @Override
    public boolean isEligible(Client client, Promotion promotion) {
        return isEligibleForBasicCriteria(client, promotion) &&
                isPromotionActiveAndValid(promotion);
    }

    /**
     * Vérifie si un client est éligible à une promotion automatique
     * Cette méthode inclut la vérification du caractère automatique
     */
    public boolean isEligibleForAutomaticPromotion(Client client, Promotion promotion) {
        return isEligible(client, promotion) &&
                promotion.isEstAutomatique();
    }

    /**
     * Vérifie les critères d'éligibilité de base (solde, type abonnement, statut client)
     */
    private boolean isEligibleForBasicCriteria(Client client, Promotion promotion) {
        // Vérifications de base
        if (client == null || promotion == null ||
                !"ACTIF".equalsIgnoreCase(client.getStatut())) {
            return false;
        }

        // Vérification solde
        if (promotion.getSoldeMinimum() != null &&
                (client.getSolde() == null ||
                        client.getSolde().compareTo(promotion.getSoldeMinimum()) < 0)) {
            return false;
        }

        // Vérification type abonnement
        if (promotion.getTypeAbonnementsEligibles() != null &&
                !promotion.getTypeAbonnementsEligibles().isEmpty() &&
                !promotion.getTypeAbonnementsEligibles().contains(client.getTypeAbonnement())) {
            return false;
        }

        return true;
    }

    /**
     * Vérifie si la promotion est active et dans sa période de validité
     */
    private boolean isPromotionActiveAndValid(Promotion promotion) {
        if (promotion == null) {
            return false;
        }

        // Vérification statut et activation
        if (!"ACTIVE".equalsIgnoreCase(promotion.getStatut()) || !promotion.isActive()) {
            return false;
        }

        // Vérification période de validité
        LocalDateTime now = LocalDateTime.now();
        if (promotion.getDateDebut() == null || promotion.getDateFin() == null ||
                now.isBefore(promotion.getDateDebut()) || now.isAfter(promotion.getDateFin())) {
            return false;
        }

        return true;
    }

    /**
     * Vérifie l'éligibilité avec diagnostic détaillé
     * @param client Le client à vérifier
     * @param promotion La promotion à vérifier
     */
    @Override
    public EligibilityResult checkEligibilityDetailed(Client client, Promotion promotion) {
        return checkEligibilityDetailed(client, promotion, false);
    }

    /**
     * Vérifie l'éligibilité avec diagnostic détaillé
     * @param client Le client à vérifier
     * @param promotion La promotion à vérifier
     * @param forAutomaticAssignment Si true, vérifie aussi que la promotion est automatique
     */
    public EligibilityResult checkEligibilityDetailed(Client client, Promotion promotion, boolean forAutomaticAssignment) {
        List<String> failedCriteria = new ArrayList<>();
        List<String> reasons = new ArrayList<>();

        // Vérification client
        if (client == null) {
            failedCriteria.add("client");
            reasons.add("Client introuvable.");
            return new EligibilityResult(false, failedCriteria, reasons);
        }

        // Vérification promotion
        if (promotion == null) {
            failedCriteria.add("promotion");
            reasons.add("Promotion introuvable.");
            return new EligibilityResult(false, failedCriteria, reasons);
        }

        // Vérification statut client
        if (!"ACTIF".equalsIgnoreCase(client.getStatut())) {
            failedCriteria.add("statut_client");
            reasons.add("Le statut du client n'est pas ACTIF.");
        }

        // Vérification période de validité
        LocalDateTime now = LocalDateTime.now();
        if (promotion.getDateDebut() == null || promotion.getDateFin() == null ||
                now.isBefore(promotion.getDateDebut()) || now.isAfter(promotion.getDateFin())) {
            failedCriteria.add("periode");
            reasons.add("La promotion n'est pas valide à cette date.");
        }

        // Vérification solde minimum
        if (promotion.getSoldeMinimum() != null &&
                client.getSolde() != null &&
                client.getSolde().compareTo(promotion.getSoldeMinimum()) < 0) {
            failedCriteria.add("solde");
            reasons.add("Le solde du client est insuffisant.");
        }

        // Vérification type d'abonnement
        if (promotion.getTypeAbonnementsEligibles() != null &&
                !promotion.getTypeAbonnementsEligibles().isEmpty() &&
                (client.getTypeAbonnement() == null ||
                        !promotion.getTypeAbonnementsEligibles().contains(client.getTypeAbonnement()))) {
            failedCriteria.add("type_abonnement");
            reasons.add("Le type d'abonnement du client n'est pas éligible.");
        }

        // Vérification statut promotion
        if (!"ACTIVE".equalsIgnoreCase(promotion.getStatut()) || !promotion.isActive()) {
            failedCriteria.add("statut_promotion");
            reasons.add("La promotion est désactivée.");
        }

        // Vérification caractère automatique (seulement si demandé)
        if (forAutomaticAssignment && !promotion.isEstAutomatique()) {
            failedCriteria.add("est_automatique");
            reasons.add("La promotion nécessite une activation manuelle.");
        }

        boolean eligible = failedCriteria.isEmpty();
        return new EligibilityResult(eligible, failedCriteria, reasons);
    }

    /**
     * Vérifie l'éligibilité pour une promotion automatique avec diagnostic détaillé
     */
    public EligibilityResult checkEligibilityForAutomaticPromotion(Client client, Promotion promotion) {
        return checkEligibilityDetailed(client, promotion, true);
    }
}