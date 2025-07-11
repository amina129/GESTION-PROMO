package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.ActivationPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivationRepository extends JpaRepository<ActivationPromotion, Long> {

    // Vérifier si une promotion est déjà active pour un client (avec LocalDate)
    boolean existsByClientIdAndPromotionIdAndDateExpirationAfter(
            Long clientId,
            Long promotionId,
            LocalDate currentDate
    );

    // Trouver toutes les promotions actives pour un client (avec LocalDate)
    @Query("SELECT ap FROM ActivationPromotion ap WHERE ap.client.id = :clientId " +
            "AND ap.dateExpiration > :currentDate")
    List<ActivationPromotion> findActivePromotionsByClientId(
            @Param("clientId") Long clientId,
            @Param("currentDate") LocalDate currentDate
    );

    // Trouver toutes les activations d'un client
    List<ActivationPromotion> findByClientId(Long clientId);

    // Trouver toutes les activations pour une promotion donnée
    List<ActivationPromotion> findByPromotionId(Long promotionId);

    // Trouver les activations dans une plage de dates (LocalDate)
    @Query("SELECT ap FROM ActivationPromotion ap WHERE " +
            "ap.dateActivation >= :startDate AND ap.dateActivation <= :endDate")
    List<ActivationPromotion> findActivationsBetweenDates(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Trouver les activations expirées (LocalDate)
    @Query("SELECT ap FROM ActivationPromotion ap WHERE ap.dateExpiration < :currentDate")
    List<ActivationPromotion> findExpiredActivations(@Param("currentDate") LocalDate currentDate);

    // Trouver les activations qui expirent à une date donnée
    List<ActivationPromotion> findByDateExpiration(LocalDate expirationDate);

    // Trouver les activations qui ont été activées à une date donnée
    List<ActivationPromotion> findByDateActivation(LocalDate activationDate);

    // Trouver les activations actives à une date donnée (entre activation et expiration)
    @Query("SELECT ap FROM ActivationPromotion ap WHERE " +
            "ap.dateActivation <= :targetDate AND ap.dateExpiration >= :targetDate")
    List<ActivationPromotion> findActivationsActiveOnDate(@Param("targetDate") LocalDate targetDate);

    // Trouver les promotions actives aujourd'hui pour un client
    @Query("SELECT ap FROM ActivationPromotion ap WHERE ap.client.id = :clientId " +
            "AND ap.dateActivation <= CURRENT_DATE AND ap.dateExpiration >= CURRENT_DATE")
    List<ActivationPromotion> findCurrentActivePromotionsByClientId(@Param("clientId") Long clientId);
}