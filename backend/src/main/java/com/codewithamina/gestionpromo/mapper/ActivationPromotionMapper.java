package com.codewithamina.gestionpromo.mapper;

import com.codewithamina.gestionpromo.dto.ActivationPromotionDTO;
import com.codewithamina.gestionpromo.entity.ActivationPromotion;

public class ActivationPromotionMapper {

    public static ActivationPromotionDTO toDTO(ActivationPromotion activation) {
        if (activation == null) return null;

        ActivationPromotionDTO dto = new ActivationPromotionDTO();

        dto.setId(activation.getId());

        if (activation.getClient() != null) {
            dto.setClientId(activation.getClient().getId());
        }

        if (activation.getPromotion() != null) {
            dto.setPromotionId(activation.getPromotion().getId());
        }

        dto.setDateActivation(activation.getDateActivation());

        return dto;
    }
}
