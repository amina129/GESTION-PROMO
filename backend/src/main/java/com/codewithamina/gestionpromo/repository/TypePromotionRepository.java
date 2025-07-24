package com.codewithamina.gestionpromo.repository;


import com.codewithamina.gestionpromo.model.TypePromotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypePromotionRepository extends JpaRepository<TypePromotion, Long> {
    TypePromotion findByCode(String code);
}