package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.MappingPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MappingPromotionRepository extends JpaRepository<MappingPromotion, Long> {
    // Tu peux ajouter des méthodes spécifiques, par ex. chercher par promotionSource ou promotionCible
}
