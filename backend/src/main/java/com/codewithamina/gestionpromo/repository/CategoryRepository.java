package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Category;
import com.codewithamina.gestionpromo.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByCode(String code);

    @Query("SELECT p FROM Promotion p JOIN p.categories c WHERE c.code = :categorieCode " +
            "AND p.statut = 'ACTIF' AND :today BETWEEN p.dateDebut AND p.dateFin")
    List<Promotion> findPromotionsByCategoryCode(
            @Param("categorieCode") String categorieCode,
            @Param("today") LocalDate today);
    List<Category> findByCodeIn(List<String> codes);



}
