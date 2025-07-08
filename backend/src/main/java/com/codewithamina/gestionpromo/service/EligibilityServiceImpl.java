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

@Service
public class EligibilityServiceImpl implements EligibilityService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Promotion> getEligiblePromotions(Client client) {
        String jpql = "SELECT p FROM Promotion p WHERE p.active = true " +
                "AND p.statut = 'ACTIVE' " +
                "AND p.dateDebut <= CURRENT_TIMESTAMP " +
                "AND p.dateFin >= CURRENT_TIMESTAMP";
        TypedQuery<Promotion> query = entityManager.createQuery(jpql, Promotion.class);
        List<Promotion> activePromotions = query.getResultList();

        return activePromotions.stream()
                .filter(promotion -> isEligible(client, promotion))
                .toList();
    }

    @Override
    public boolean isEligible(Client client, Promotion promotion) {
        if (client == null || promotion == null) {
            return false;
        }

        // Vérifier d'abord si la promotion est active et a le bon statut
        if (!"ACTIVE".equals(promotion.getStatut()) || !promotion.isActive()) {
            return false;
        }

        // Vérifier le statut du client
        if (!"ACTIF".equalsIgnoreCase(client.getStatut())) {
            return false;
        }

        // Vérifier la période de validité
        LocalDateTime now = LocalDateTime.now();
        if (promotion.getDateDebut() == null || promotion.getDateFin() == null ||
                now.isBefore(promotion.getDateDebut()) || now.isAfter(promotion.getDateFin())) {
            return false;
        }

        // Vérifier le solde minimum
        if (promotion.getSoldeMinimum() != null &&
                client.getSolde() != null &&
                client.getSolde().compareTo(promotion.getSoldeMinimum()) < 0) {
            return false;
        }

        // Vérifier le type d'abonnement
        if (promotion.getTypeAbonnementsEligibles() != null &&
                !promotion.getTypeAbonnementsEligibles().isEmpty() &&
                (client.getTypeAbonnement() == null ||
                        !promotion.getTypeAbonnementsEligibles().contains(client.getTypeAbonnement()))) {
            return false;
        }

        return true;
    }

    @Override
    public EligibilityResult checkEligibilityDetailed(Client client, Promotion promotion) {
        List<String> failedCriteria = new ArrayList<>();
        List<String> reasons = new ArrayList<>();

        if (client == null) {
            failedCriteria.add("client");
            reasons.add("Client introuvable.");
            return new EligibilityResult(false, failedCriteria, reasons);
        }

        if (promotion == null) {
            failedCriteria.add("promotion");
            reasons.add("Promotion introuvable.");
            return new EligibilityResult(false, failedCriteria, reasons);
        }

        if (!"ACTIF".equalsIgnoreCase(client.getStatut())) {
            failedCriteria.add("statut_client");
            reasons.add("Le statut du client n'est pas ACTIF.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (promotion.getDateDebut() == null || promotion.getDateFin() == null ||
                now.isBefore(promotion.getDateDebut()) || now.isAfter(promotion.getDateFin())) {
            failedCriteria.add("periode");
            reasons.add("La promotion n'est pas valide à cette date.");
        }

        if (promotion.getSoldeMinimum() != null &&
                client.getSolde() != null &&
                client.getSolde().compareTo(promotion.getSoldeMinimum()) < 0) {
            failedCriteria.add("solde");
            reasons.add("Le solde du client est insuffisant.");
        }

        if (promotion.getTypeAbonnementsEligibles() != null &&
                !promotion.getTypeAbonnementsEligibles().isEmpty() &&
                (client.getTypeAbonnement() == null ||
                        !promotion.getTypeAbonnementsEligibles().contains(client.getTypeAbonnement()))) {
            failedCriteria.add("type_abonnement");
            reasons.add("Le type d'abonnement du client n'est pas éligible.");
        }

        if (!"ACTIF".equalsIgnoreCase(promotion.getStatut()) || !promotion.isActive()) {
            failedCriteria.add("statut_promotion");
            reasons.add("La promotion est désactivée.");
        }

        if (!promotion.isEstAutomatique()) {
            failedCriteria.add("est_automatique");
            reasons.add("La promotion nécessite un code manuel.");
        }

        boolean eligible = failedCriteria.isEmpty();
        return new EligibilityResult(eligible, failedCriteria, reasons);
    }


}
