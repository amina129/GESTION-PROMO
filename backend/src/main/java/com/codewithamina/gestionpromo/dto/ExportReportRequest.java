package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportReportRequest {
    private FilterDto filters;

    @NotNull(message = "Les statistiques sont requises")
    private StatisticsDataDto statistics;

    @Builder.Default
    private String format = "email";
}