package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.MappingPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MappingPromotionRepository extends JpaRepository<MappingPromotion, Long> {
}
