package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p WHERE p.active = true AND p.estAutomatique = true AND p.dateDebut <= CURRENT_TIMESTAMP AND p.dateFin >= CURRENT_TIMESTAMP")
    List<Promotion> findAllActiveAutomaticPromotions();
    List<Promotion> findByActiveTrue();
    Optional<Promotion> findByCodePromotion(String codePromotion);
    @Query("SELECT p FROM Promotion p WHERE p.active = true " +
            "AND p.dateDebut <= :currentDate " +
            "AND (p.dateFin IS NULL OR p.dateFin >= :currentDate)")
    List<Promotion> findActivePromotions(@Param("currentDate") LocalDateTime currentDate);
}

