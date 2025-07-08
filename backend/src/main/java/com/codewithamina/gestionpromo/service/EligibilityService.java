package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.EligibilityResult;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;

import java.util.List;

public interface EligibilityService {

    /**
     * Récupère les promotions automatiques éligibles pour un client
     * Utilisé pour l'attribution automatique des promotions
     */
    List<Promotion> getEligiblePromotions(Client client);

    /**
     * Vérifie si un client est éligible à une promotion (automatique ou manuelle)
     * Vérifie uniquement les critères d'éligibilité, pas le type d'activation
     */
    boolean isEligible(Client client, Promotion promotion);

    /**
     * Vérifie si un client est éligible à une promotion automatique
     * Inclut la vérification du caractère automatique
     */
    boolean isEligibleForAutomaticPromotion(Client client, Promotion promotion);

    /**
     * Vérifie l'éligibilité avec diagnostic détaillé
     * Par défaut, ne vérifie pas le caractère automatique
     */
    EligibilityResult checkEligibilityDetailed(Client client, Promotion promotion);

    /**
     * Vérifie l'éligibilité avec diagnostic détaillé
     * Permet de spécifier si on vérifie pour une attribution automatique
     */
    EligibilityResult checkEligibilityDetailed(Client client, Promotion promotion, boolean forAutomaticAssignment);

    /**
     * Vérifie l'éligibilité pour une promotion automatique avec diagnostic détaillé
     */
    EligibilityResult checkEligibilityForAutomaticPromotion(Client client, Promotion promotion);
}