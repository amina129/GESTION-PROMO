package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.StatistiquesPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatistiquesPromotionRepository extends JpaRepository<StatistiquesPromotion, Long> {
}
