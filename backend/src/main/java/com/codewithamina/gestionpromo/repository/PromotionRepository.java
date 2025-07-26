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

    // ✅ NOUVELLE REQUÊTE OPTIMISÉE - Promotions pour un client spécifique
    @Query("SELECT DISTINCT p FROM Promotion p " +
            "JOIN p.categories cat " +
            "JOIN Client c ON c.categorieClient.code = cat.code " +
            "WHERE c.id = :clientId " +
            "AND p.statut = 'ACTIF' " +
            "AND CURRENT_DATE BETWEEN p.dateDebut AND p.dateFin " +
            "AND NOT EXISTS (" +
            "  SELECT ap FROM Client cl JOIN cl.promotions ap " +
            "  WHERE ap.id = p.id AND cl.id = :clientId" +
            ")")
    List<Promotion> findAvailablePromotionsForClient(@Param("clientId") Long clientId);

    // ✅ REQUÊTE OPTIMISÉE - Par code de catégorie
    @Query("SELECT p FROM Promotion p " +
            "JOIN p.categories c " +
            "WHERE p.statut = 'ACTIF' " +
            "AND :today BETWEEN p.dateDebut AND p.dateFin " +
            "AND c.code = :categorieClient")
    List<Promotion> findAvailableByCategorieClient(
            @Param("categorieClient") String categorieClient,
            @Param("today") LocalDate today);

    // ✅ VOS REQUÊTES EXISTANTES (gardées pour compatibilité)
    @Query("SELECT DISTINCT p FROM Promotion p LEFT JOIN p.categories c WHERE " +
            "p.statut = 'ACTIF' AND " +
            "(:#{#nom == null} = true OR LOWER(p.nom) LIKE LOWER(CONCAT('%', :nom, '%'))) AND " +
            "(:#{#type == null} = true OR p.type = :type) AND " +
            "(:#{#sousType == null} = true OR p.sousType = :sousType) AND " +
            "(:#{#dateDebut == null} = true OR :#{#dateFin == null} = true OR " +
            " (p.dateDebut <= :dateFin AND p.dateFin >= :dateDebut)) AND " +
            "(:#{#categorieClient == null} = true OR c.code = :categorieClient) AND " +
            "CURRENT_DATE >= p.dateDebut")
    List<Promotion> searchPromotions(
            @Param("nom") String nom,
            @Param("type") String type,
            @Param("sousType") String sousType,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin,
            @Param("categorieClient") String categorieClient);

    @Query("SELECT p FROM Promotion p JOIN p.categories c " +
            "WHERE p.statut = 'ACTIF' AND " +
            "c.code = :categorieClient AND " +
            "p.dateDebut <= :dateFin AND " +
            "p.dateFin >= :dateDebut AND " +
            "p.dateDebut <= CURRENT_DATE AND " +
            "NOT EXISTS (" +
            "  SELECT cl FROM Client cl JOIN cl.promotions pr " +
            "  WHERE pr.id = p.id AND cl.id = :clientId" +
            ")")
    List<Promotion> findAvailablePromotionsForClientAndDateRange(
            @Param("categorieClient") String categorieClient,
            @Param("clientId") Long clientId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin);

    @EntityGraph(attributePaths = "categories")
    Optional<Promotion> findWithCategoriesById(Long id);
}