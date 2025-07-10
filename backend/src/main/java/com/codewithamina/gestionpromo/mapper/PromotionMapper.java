package com.codewithamina.gestionpromo.mapper;

import com.codewithamina.gestionpromo.dto.PromotionDTO;
import com.codewithamina.gestionpromo.model.Promotion;

import java.time.LocalDate;

public class PromotionMapper {
    public static PromotionDTO toDTO(Promotion promo) {
        if (promo == null) return null;

        PromotionDTO dto = new PromotionDTO();
        dto.setId(promo.getId());
        dto.setNom(promo.getNom());
        dto.setDescription(promo.getDescription());

        // Conversion sécurisée des dates
        LocalDate dateDebut = promo.getDateDebut() != null ? promo.getDateDebut().toLocalDate() : null;
        LocalDate dateFin = promo.getDateFin() != null ? promo.getDateFin().toLocalDate() : null;

        dto.setDateDebut(dateDebut);
        dto.setDateFin(dateFin);


        return dto;
    }
}
