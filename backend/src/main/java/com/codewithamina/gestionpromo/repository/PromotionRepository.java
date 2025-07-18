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

    @Query("SELECT p FROM Promotion p JOIN p.categories c WHERE " +
            "(:#{#nom == null} = true OR p.nom LIKE %:nom%) AND " +
            "(:#{#type == null} = true OR p.type = :type) AND " +
            "(:#{#sousType == null} = true OR p.sousType = :sousType) AND " +
            "(:#{#dateDebut == null} = true OR p.dateDebut >= :dateDebut) AND " +
            "(:#{#dateFin == null} = true OR p.dateFin <= :dateFin) AND " +
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
}
