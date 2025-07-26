package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.ActivationPromotion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivationRepository extends JpaRepository<ActivationPromotion, Long> {

    // Vérifier si une promotion est déjà active pour un client (avec LocalDate)
    boolean existsByClientIdAndPromotionIdAndDateExpirationAfter(
            Long clientId,
            Long promotionId,
            LocalDate currentDate
    );
    // Trouver toutes les activations d'un client
    List<ActivationPromotion> findByClientId(Long clientId);

    @Query("""
    SELECT p.nom, COUNT(a.id)
    FROM ActivationPromotion a
    JOIN a.promotion p
    JOIN a.client c
    WHERE p.type = 'absolu'
    GROUP BY p.nom
    ORDER BY COUNT(a.id) DESC
    """)
    List<Object[]> findTopPromotions(Pageable pageable);

    @Query(value = """
    SELECT to_char(a.dateActivation, 'DD') as day, COUNT(a.id) as count 
    FROM ActivationPromotion a 
    JOIN a.promotion p 
    JOIN a.client c 
    JOIN c.categorieClient cat 
    WHERE cat.code = :clientCategory 
    AND p.type = :promoType 
    AND EXTRACT(YEAR FROM a.dateActivation) = :year 
    AND EXTRACT(MONTH FROM a.dateActivation) = :month 
    GROUP BY to_char(a.dateActivation, 'DD') 
    ORDER BY to_char(a.dateActivation, 'DD')
    """)
    List<Object[]> findMonthlyActivations(
            @Param("clientCategory") String clientCategory,
            @Param("promoType") String promoType,
            @Param("year") int year,
            @Param("month") int month
    );

}

