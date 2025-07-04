package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.PromotionCritere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionCritereRepository extends JpaRepository<PromotionCritere, Long> {
    // Tu peux ajouter des méthodes spécifiques si besoin, par exemple :
    // List<PromotionCritere> findByPromotionId(Long promotionId);
}
