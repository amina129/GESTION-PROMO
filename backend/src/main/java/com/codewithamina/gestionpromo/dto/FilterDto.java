package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterDto {
    private String month;
    private String clientCategory;
    private String promoType;
    private LocalDate startDate;
    private LocalDate endDate;
}