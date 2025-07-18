package com.codewithamina.gestionpromo.mapper;

import com.codewithamina.gestionpromo.dto.PromotionDTO;
import com.codewithamina.gestionpromo.model.Category;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.CategoryRepository;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;


@Component
public class PromotionMapper {
    private final CategoryRepository categoryRepository;

    public PromotionMapper(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public PromotionDTO toDto(Promotion promotion) {
        PromotionDTO dto = new PromotionDTO();
        dto.setId(promotion.getId());
        dto.setNom(promotion.getNom());
        dto.setDescription(promotion.getDescription());
        dto.setDateDebut(promotion.getDateDebut());
        dto.setDateFin(promotion.getDateFin());
        dto.setType(promotion.getType());
        dto.setSousType(promotion.getSousType());
        dto.setValeur(promotion.getValeur());
        dto.setCategorieClient(promotion.getCategorieClient()); // maintenant une List<String>
        dto.setTypeUnite(promotion.getTypeUnite());
        dto.setUniteMesure(promotion.getUniteMesure());
        dto.setStatut(promotion.getStatut());
        return dto;
    }

    public Promotion toEntity(PromotionDTO dto) {
        Promotion promotion = new Promotion();
        promotion.setId(dto.getId());
        promotion.setNom(dto.getNom());
        promotion.setDescription(dto.getDescription());
        promotion.setDateDebut(dto.getDateDebut());
        promotion.setDateFin(dto.getDateFin());
        promotion.setType(dto.getType());
        promotion.setSousType(dto.getSousType());
        promotion.setValeur(dto.getValeur());

        // Conversion des codes de catégories en entités Category
        if (dto.getCategorieClient() != null && !dto.getCategorieClient().isEmpty()) {
            List<Category> categories = categoryRepository.findByCodeIn(dto.getCategorieClient());
            promotion.setCategories(new HashSet<>(categories));
        } else {
            promotion.setCategories(Collections.emptySet());
        }
        promotion.setTypeUnite(dto.getTypeUnite());
        promotion.setUniteMesure(dto.getUniteMesure());
        promotion.setStatut(dto.getStatut());

        return promotion;
    }

}
