package com.codewithamina.gestionpromo.mapper;

import com.codewithamina.gestionpromo.dto.PromotionDTO;
import com.codewithamina.gestionpromo.model.Promotion;
import org.springframework.stereotype.Component;

@Component
public class PromotionMapper {

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
        dto.setCategorieClient(promotion.getCategorieClient());
        dto.setTypeUnite(promotion.getTypeUnite());
        dto.setUniteMesure(promotion.getUniteMesure());
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
        promotion.setCategorieClient(dto.getCategorieClient());
        promotion.setTypeUnite(dto.getTypeUnite());
        promotion.setUniteMesure(dto.getUniteMesure());
        return promotion;
    }
}