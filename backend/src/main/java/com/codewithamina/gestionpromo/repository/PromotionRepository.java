package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p WHERE " +
            "(:#{#nom == null} = true OR p.nom LIKE %:nom%) AND " +
            "(:#{#type == null} = true OR p.type = :type) AND " +
            "(:#{#sousType == null} = true OR p.sousType = :sousType) AND " +
            "(:#{#dateDebut == null} = true OR p.dateDebut >= :dateDebut) AND " +
            "(:#{#dateFin == null} = true OR p.dateFin <= :dateFin) AND " +
            "(:#{#categorieClient == null} = true OR p.categorieClient = :categorieClient)")
    List<Promotion> searchPromotions(
            @Param("nom") String nom,
            @Param("type") String type,
            @Param("sousType") String sousType,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin,
            @Param("categorieClient") String categorieClient);

    List<Promotion> findByCategorieClientAndActiveTrue(String categorieClient);

}

