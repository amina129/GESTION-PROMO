package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionStatisticsDto {
    private String promoName;
    private String clientCategory;
    private String promoType;
    private Integer totalActivations;
    private Double totalRevenue;
    private Integer count;
}