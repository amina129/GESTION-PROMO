package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.entity.ActivationPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
public interface ActivationPromotionRepository extends JpaRepository<ActivationPromotion, Long> {

    // Méthode simple avec paramètre statut
    List<ActivationPromotion> findByClient_IdAndStatut(Long clientId, String statut);

    // Ou requête JPQL fixe
    @Query("SELECT a FROM ActivationPromotion a WHERE a.client.id = :clientId AND a.statut = 'ACTIVE'")
    List<ActivationPromotion> findActiveByClientId(@Param("clientId") Long clientId);
}
