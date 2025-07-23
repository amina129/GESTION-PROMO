package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopPromotionDto {
    private String promoName;
    private String clientCategory;
    private String promoType;
    private Integer activations;
    private Double revenue;

    public TopPromotionDto(String promoName, String clientCategory, String promoType, Long activations, Double revenue) {
        this.promoName = promoName;
        this.clientCategory = clientCategory;
        this.promoType = promoType;
        this.activations = activations != null ? activations.intValue() : 0;
        this.revenue = revenue != null ? revenue : 0.0;
    }
}