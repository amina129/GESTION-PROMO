package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendDataDto {
    private String period;
    private Integer activations;
    private Double revenue;
    private Integer average;
    private Long count;

    // Constructor pour les requêtes JPQL
    public TrendDataDto(String period, Long activations, Double revenue, Double average, Long count) {
        this.period = period;
        this.activations = activations != null ? activations.intValue() : 0;
        this.revenue = revenue != null ? revenue : 0.0;
        this.average = average != null ? average.intValue() : 0;
        this.count = count != null ? count : 0L;
    }
}