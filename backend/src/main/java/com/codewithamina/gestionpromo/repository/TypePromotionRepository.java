package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.TypePromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypePromotionRepository extends JpaRepository<TypePromotion, Long> {

}
