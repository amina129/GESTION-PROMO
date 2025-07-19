package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDataDto {
    private Integer totalActivations;
    private Double totalRevenue;
    private Integer averageActivations;
    private List<TopPromotionDto> topPromotions;
}
