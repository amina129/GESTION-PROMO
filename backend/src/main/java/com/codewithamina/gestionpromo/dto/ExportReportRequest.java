package com.codewithamina.gestionpromo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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