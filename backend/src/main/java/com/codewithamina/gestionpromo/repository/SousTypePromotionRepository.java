package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.SousTypePromotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SousTypePromotionRepository extends JpaRepository<SousTypePromotion, Long> {
    List<SousTypePromotion> findByTypePromotionCode(String typeCode);
}