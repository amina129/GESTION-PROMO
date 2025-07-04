package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.StatistiquesPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StatistiquesPromotionRepository extends JpaRepository<StatistiquesPromotion, Long> {

    // Exemple : récupérer toutes les statistiques pour une promotion donnée
    List<StatistiquesPromotion> findByPromotionId(Long promotionId);

    // Exemple : récupérer les statistiques d'une promotion à une date donnée
    StatistiquesPromotion findByPromotionIdAndDateStatistique(Long promotionId, LocalDate dateStatistique);
}
