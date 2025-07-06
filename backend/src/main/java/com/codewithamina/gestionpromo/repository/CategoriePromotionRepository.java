package com.codewithamina.gestionpromo.repository;
import com.codewithamina.gestionpromo.model.CategoriePromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriePromotionRepository extends JpaRepository<CategoriePromotion, Long> {
}
