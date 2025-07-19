package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Promotion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT DISTINCT p FROM Promotion p LEFT JOIN p.categories c WHERE " +
            "p.statut = 'ACTIF' AND " +
            "(:#{#nom == null} = true OR LOWER(p.nom) LIKE LOWER(CONCAT('%', :nom, '%'))) AND " +
            "(:#{#type == null} = true OR p.type = :type) AND " +
            "(:#{#sousType == null} = true OR p.sousType = :sousType) AND " +
            "(:#{#dateDebut == null} = true OR :#{#dateFin == null} = true OR " +
            " (p.dateDebut <= :dateFin AND p.dateFin >= :dateDebut)) AND " +
            "(:#{#categorieClient == null} = true OR c.code = :categorieClient)")
    List<Promotion> searchPromotions(
            @Param("nom") String nom,
            @Param("type") String type,
            @Param("sousType") String sousType,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin,
            @Param("categorieClient") String categorieClient);


    @Query("SELECT p FROM Promotion p JOIN p.categories c " +
            "WHERE p.statut = 'ACTIF' " +
            "AND :today BETWEEN p.dateDebut AND p.dateFin " +
            "AND p.dateDebut >= :intervalStart " +
            "AND p.dateFin <= :intervalEnd " +
            "AND (:categorieClient IS NULL OR c.code = :categorieClient)")
    List<Promotion> findAvailableByCategorieClientAndInterval(
            @Param("categorieClient") String categorieClient,
            @Param("today") LocalDate today,
            @Param("intervalStart") LocalDate intervalStart,
            @Param("intervalEnd") LocalDate intervalEnd);

    @Query("SELECT p FROM Promotion p JOIN p.categories c WHERE " +
            "c.code = :categorieClient AND " +
            "p.dateDebut <= CURRENT_DATE AND " +
            "p.dateFin >= CURRENT_DATE AND " +
            "p.statut = 'ACTIF' AND " +
            "NOT EXISTS (" +
            "  SELECT ap FROM ActivationPromotion ap " +
            "  WHERE ap.promotion.id = p.id AND ap.client.id = :clientId" +
            ")")
    List<Promotion> findAvailableByCategorieClientAndClientId(
            @Param("categorieClient") String categorieClient,
            @Param("clientId") Long clientId);


    @Query("SELECT p FROM Promotion p JOIN p.categories c " +
            "WHERE p.statut = 'ACTIF' " +
            "AND :today BETWEEN p.dateDebut AND p.dateFin " +
            "AND (:categorieClient IS NULL OR c.code = :categorieClient)")
    List<Promotion> findAvailableByCategorieClient(
            @Param("categorieClient") String categorieClient,
            @Param("today") LocalDate today);

    @Query("SELECT p FROM Promotion p JOIN p.categories c " +
            "WHERE p.statut = 'ACTIF' AND " +
            "c.code = :categorieClient AND " +
            "p.dateDebut <= :dateFin AND " +
            "p.dateFin >= :dateDebut AND " +
            "NOT EXISTS (" +
            "  SELECT ap FROM ActivationPromotion ap " +
            "  WHERE ap.promotion.id = p.id AND ap.client.id = :clientId" +
            ")")
    List<Promotion> findAvailablePromotionsForClientAndDateRange(
            @Param("categorieClient") String categorieClient,
            @Param("clientId") Long clientId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin);

    @EntityGraph(attributePaths = "categories")
    Optional<Promotion> findWithCategoriesById(Long id);
    @Query("SELECT p FROM Promotion p WHERE " +
            "(:month IS NULL OR p.month = :month) AND " +
            "(:clientCategory IS NULL OR p.clientCategory = :clientCategory) AND " +
            "(:promoType IS NULL OR p.promoType = :promoType) AND " +
            "(:startDate IS NULL OR p.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR p.createdAt <= :endDate)")
    List<Promotion> findWithFilters(
            @Param("month") String month,
            @Param("clientCategory") String clientCategory,
            @Param("promoType") String promoType,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(p.activations), 0) FROM Promotion p")
    Integer sumAllActivations();

    @Query("SELECT COALESCE(SUM(p.revenue), 0.0) FROM Promotion p")
    Double sumAllRevenue();

    @Query("SELECT new com.yourapp.dto.MonthlyStatsDto(p.month, SUM(p.activations), SUM(p.revenue)) " +
            "FROM Promotion p GROUP BY p.month ORDER BY p.month DESC")
    List<MonthlyStatsDto> getMonthlyStats();

    @Query("SELECT new com.yourapp.dto.TrendDataDto(" +
            "FUNCTION('DATE_FORMAT', p.createdAt, '%Y-%m-%d'), " +
            "SUM(p.activations), SUM(p.revenue), AVG(p.activations), COUNT(p)) " +
            "FROM Promotion p GROUP BY FUNCTION('DATE_FORMAT', p.createdAt, '%Y-%m-%d') " +
            "ORDER BY FUNCTION('DATE_FORMAT', p.createdAt, '%Y-%m-%d')")
    List<TrendDataDto> getDailyTrends();

    @Query("SELECT new com.yourapp.dto.TrendDataDto(" +
            "FUNCTION('YEARWEEK', p.createdAt), " +
            "SUM(p.activations), SUM(p.revenue), AVG(p.activations), COUNT(p)) " +
            "FROM Promotion p GROUP BY FUNCTION('YEARWEEK', p.createdAt) " +
            "ORDER BY FUNCTION('YEARWEEK', p.createdAt)")
    List<TrendDataDto> getWeeklyTrends();

    @Query("SELECT new com.yourapp.dto.TrendDataDto(" +
            "p.month, SUM(p.activations), SUM(p.revenue), AVG(p.activations), COUNT(p)) " +
            "FROM Promotion p GROUP BY p.month ORDER BY p.month")
    List<TrendDataDto> getMonthlyTrends();

    @Query("SELECT new com.yourapp.dto.TopPromotionDto(" +
            "p.promoName, p.clientCategory, p.promoType, SUM(p.activations), SUM(p.revenue)) " +
            "FROM Promotion p GROUP BY p.promoName, p.clientCategory, p.promoType " +
            "ORDER BY SUM(p.activations) DESC")
    List<TopPromotionDto> findTopByActivations(@Param("limit") int limit);

    @Query("SELECT new com.yourapp.dto.TopPromotionDto(" +
            "p.promoName, p.clientCategory, p.promoType, SUM(p.activations), SUM(p.revenue)) " +
            "FROM Promotion p GROUP BY p.promoName, p.clientCategory, p.promoType " +
            "ORDER BY SUM(p.revenue) DESC")
    List<TopPromotionDto> findTopByRevenue(@Param("limit") int limit);
}
