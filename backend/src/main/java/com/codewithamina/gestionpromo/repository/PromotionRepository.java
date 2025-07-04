package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p WHERE p.active = true AND p.estAutomatique = true AND p.dateDebut <= CURRENT_TIMESTAMP AND p.dateFin >= CURRENT_TIMESTAMP")
    List<Promotion> findAllActiveAutomaticPromotions();
}

