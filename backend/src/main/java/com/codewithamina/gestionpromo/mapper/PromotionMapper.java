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
        dto.setTypePromotion(promo.getType());
        dto.setDateDebut(LocalDate.from(promo.getDateDebut()));
        dto.setDateFin(LocalDate.from(promo.getDateFin()));
        dto.setTypePromotion(promo.getType());

        if (promo.getCodePromotion() == null || promo.getCodePromotion().isEmpty()) {
            dto.setCodePromotion("PROMO" + promo.getId());
        } else {
            dto.setCodePromotion(promo.getCodePromotion());
        }

        // Determine status
        String status = "UNKNOWN";
        LocalDate today = LocalDate.now();
        LocalDate dateFin = LocalDate.from(promo.getDateFin());

        if (promo.getActive() != null && promo.getActive()) {
            status = "ACTIVE";
        } else if (dateFin != null && dateFin.isBefore(today)) {
            status = "EXPIRED";
        } else {
            status = "UNKNOWN";
        }
        dto.setPointsFidelite(null);
        dto.setStatut(status);

        dto.setDateDebut(promo.getDateDebut() != null ? promo.getDateDebut().toLocalDate() : null);
        dto.setDateFin(promo.getDateFin() != null ? promo.getDateFin().toLocalDate() : null);

        return dto;
    }
}