package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.ActivationPromotion;
import org.springframework.data.domain.Pageable;
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
    // Trouver toutes les activations d'un client
    List<ActivationPromotion> findByClientId(Long clientId);
    // Trouver les activations expirées (LocalDate)
    @Query("SELECT ap FROM ActivationPromotion ap WHERE ap.dateExpiration < :currentDate")
    List<ActivationPromotion> findExpiredActivations(@Param("currentDate") LocalDate currentDate);
    // Trouver les activations actives à une date donnée (entre activation et expiration)
    @Query("SELECT ap FROM ActivationPromotion ap WHERE " +
            "ap.dateActivation <= :targetDate AND ap.dateExpiration >= :targetDate")
    List<ActivationPromotion> findActivationsActiveOnDate(@Param("targetDate") LocalDate targetDate);
    // Trouver les promotions actives aujourd'hui pour un client
    @Query("SELECT ap FROM ActivationPromotion ap WHERE ap.client.id = :clientId " +
            "AND ap.dateActivation <= CURRENT_DATE AND ap.dateExpiration >= CURRENT_DATE")
    List<ActivationPromotion> findCurrentActivePromotionsByClientId(@Param("clientId") Long clientId);
    void deleteAll(Iterable<? extends ActivationPromotion> entities);



    @Query("SELECT COUNT(ap) FROM ActivationPromotion ap WHERE ap.promotion.id = :promoId")
    int countActivationsByPromotionId(@Param("promoId") Long promoId);
    @Query("SELECT COUNT(ap) FROM ActivationPromotion ap WHERE ap.dateActivation = CURRENT_DATE")
    long countTodayActivations();
    @Query("SELECT COUNT(ap) FROM ActivationPromotion ap WHERE ap.dateActivation >= :startOfWeek")
    long countThisWeekActivations(@Param("startOfWeek") LocalDate startOfWeek);
    @Query("SELECT COUNT(ap) FROM ActivationPromotion ap WHERE ap.dateActivation >= :startOfMonth")
    long countThisMonthActivations(@Param("startOfMonth") LocalDate startOfMonth);


    @Query("""
    SELECT p.nom, COUNT(a.id)
    FROM ActivationPromotion a
    JOIN a.promotion p
    JOIN a.client c
    WHERE p.type = 'absolu'
    GROUP BY p.nom
    ORDER BY COUNT(a.id) DESC
    """)
    List<Object[]> findTopPromotions(Pageable pageable);

    @Query(value = "SELECT to_char(a.dateActivation, 'DD'), COUNT(a.id) " +
            "FROM ActivationPromotion a " +
            "JOIN a.promotion p " +
            "JOIN a.client c " +
            "WHERE c.categorieClient = :clientCategory " +
            "AND p.type = :promoType " +
            "AND EXTRACT(YEAR FROM a.dateActivation) = :year " +
            "AND EXTRACT(MONTH FROM a.dateActivation) = :month " +
            "GROUP BY to_char(a.dateActivation, 'DD') " +
            "ORDER BY to_char(a.dateActivation, 'DD')")
    List<Object[]> findMonthlyActivations(@Param("clientCategory") String clientCategory,
                                          @Param("promoType") String promoType,
                                          @Param("year") int year,
                                          @Param("month") int month);
}