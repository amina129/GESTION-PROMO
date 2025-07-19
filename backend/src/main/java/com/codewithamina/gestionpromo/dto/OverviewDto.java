package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverviewDto {
    private Long totalPromotions;
    private Long totalClients;
    private Integer totalActivations;
    private Double totalRevenue;
}
