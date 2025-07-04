package com.codewithamina.gestionpromo.mapper;

import com.codewithamina.gestionpromo.dto.PromotionDTO;
import com.codewithamina.gestionpromo.entity.Promotion;

public class PromotionMapper {
    public static PromotionDTO toDTO(Promotion promo) {
        if (promo == null) return null;

        PromotionDTO dto = new PromotionDTO();
        dto.setId(promo.getId());
        dto.setNom(promo.getNom());
        dto.setDescription(promo.getDescription());
        dto.setTypePromotion(promo.getType());


        dto.setPointsFidelite(null);

        dto.setDateDebut(promo.getDateDebut() != null ? promo.getDateDebut().toLocalDate() : null);
        dto.setDateFin(promo.getDateFin() != null ? promo.getDateFin().toLocalDate() : null);

        return dto;
    }
}
