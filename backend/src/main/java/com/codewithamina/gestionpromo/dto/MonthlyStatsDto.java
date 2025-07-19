package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStatsDto {
    private String month;
    private Integer activations;
    private Double revenue;

    // Constructor pour les requêtes JPQL
    public MonthlyStatsDto(String month, Long activations, Double revenue) {
        this.month = month;
        this.activations = activations != null ? activations.intValue() : 0;
        this.revenue = revenue != null ? revenue : 0.0;
    }
}
