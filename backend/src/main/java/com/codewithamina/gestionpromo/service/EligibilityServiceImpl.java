package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.EligibilityResult;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EligibilityServiceImpl implements EligibilityService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Promotion> getEligiblePromotions(Client client) {
        String jpql = "SELECT p FROM Promotion p WHERE p.active = true AND p.dateDebut <= CURRENT_TIMESTAMP AND p.dateFin >= CURRENT_TIMESTAMP";
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

        // 1. Vérifier le statut du client
        if (!"ACTIF".equalsIgnoreCase(client.getStatut())) {
            return false;
        }

        // 2. Vérifier la période de validité
        LocalDateTime now = LocalDateTime.now();
        if (promotion.getDateDebut() == null || promotion.getDateFin() == null ||
                now.isBefore(promotion.getDateDebut()) || now.isAfter(promotion.getDateFin())) {
            return false;
        }

        if (promotion.getSoldeMinimum() != null &&
                client.getSolde() != null &&
                client.getSolde().compareTo(promotion.getSoldeMinimum()) < 0) {
            return false;
        }



        if (promotion.getTypeAbonnementsEligibles() != null &&
                !promotion.getTypeAbonnementsEligibles().isEmpty() &&
                (client.getTypeAbonnement() == null || !promotion.getTypeAbonnementsEligibles().contains(client.getTypeAbonnement()))) {
            return false;
        }

        if (!"ACTIVE".equalsIgnoreCase(promotion.getStatut()) && !promotion.isActive()) {
            return false;
        }

        // 8. Vérifier si la promotion nécessite un code, ici on suppose qu’on ne considère que les promotions automatiques
        if (!promotion.isEstAutomatique()) {
            return false;
        }


        return true;
    }

    @Override
    public EligibilityResult checkEligibilityDetailed(Client client, Promotion promotion) {
        return null;
    }

}
