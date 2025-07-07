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

        // Conversion sécurisée des dates
        LocalDate dateDebut = promo.getDateDebut() != null ? promo.getDateDebut().toLocalDate() : null;
        LocalDate dateFin = promo.getDateFin() != null ? promo.getDateFin().toLocalDate() : null;

        dto.setDateDebut(dateDebut);
        dto.setDateFin(dateFin);

        // Code promotion
        if (promo.getCodePromotion() == null || promo.getCodePromotion().isEmpty()) {
            dto.setCodePromotion("PROMO" + promo.getId());
        } else {
            dto.setCodePromotion(promo.getCodePromotion());
        }

        // Statut
        String status;
        LocalDate today = LocalDate.now();

        if (Boolean.TRUE.equals(promo.getActive())) {
            status = "ACTIVE";
        } else if (dateFin != null && dateFin.isBefore(today)) {
            status = "EXPIRED";
        } else {
            status = "UNKNOWN";
        }

        dto.setStatut(status);
        dto.setPointsFidelite(null); // à adapter si nécessaire

        return dto;
    }
}
