package com.codewithamina.gestionpromo.controller;


import com.codewithamina.gestionpromo.dto.*;
import com.codewithamina.gestionpromo.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "API pour les statistiques et analyses")
@PreAuthorize("hasRole('USER')") // Sécurité au niveau du controller
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/promotions")
    @Operation(summary = "Obtenir les statistiques des promotions avec filtres")
    public ResponseEntity<StatisticsResponse<List<PromotionStatisticsDto>>> getPromotionStatistics(
            @Parameter(description = "Mois au format YYYY-MM")
            @RequestParam(required = false) String month,

            @Parameter(description = "Catégorie de client")
            @RequestParam(required = false) String clientCategory,

            @Parameter(description = "Type de promotion")
            @RequestParam(required = false) String promoType,

            @Parameter(description = "Date de début")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @Parameter(description = "Date de fin")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<PromotionStatisticsDto> statistics = statisticsService.getPromotionStatistics(
                month, clientCategory, promoType, startDate, endDate);

        return ResponseEntity.ok(StatisticsResponse.<List<PromotionStatisticsDto>>builder()
                .success(true)
                .data(statistics)
                .timestamp(java.time.Instant.now())
                .build());
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Statistiques globales pour le dashboard")
    public ResponseEntity<StatisticsResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto dashboardStats = statisticsService.getDashboardStats();

        return ResponseEntity.ok(StatisticsResponse.<DashboardStatsDto>builder()
                .success(true)
                .data(dashboardStats)
                .timestamp(java.time.Instant.now())
                .build());
    }

    @GetMapping("/trends")
    @Operation(summary = "Analyse des tendances temporelles")
    public ResponseEntity<StatisticsResponse<TrendsDto>> getTrends(
            @Parameter(description = "Période d'analyse")
            @RequestParam(defaultValue = "monthly") String period,

            @Parameter(description = "Métrique à analyser")
            @RequestParam(defaultValue = "activations") String metric) {

        TrendsDto trends = statisticsService.getTrends(period, metric);

        return ResponseEntity.ok(StatisticsResponse.<TrendsDto>builder()
                .success(true)
                .data(trends)
                .timestamp(java.time.Instant.now())
                .build());
    }

    @PostMapping("/export-report")
    @Operation(summary = "Générer un rapport pour export")
    public ResponseEntity<StatisticsResponse<ExportReportResponse>> exportReport(
            @Valid @RequestBody ExportReportRequest request) {

        ExportReportResponse reportResponse = statisticsService.generateReport(request);

        return ResponseEntity.ok(StatisticsResponse.<ExportReportResponse>builder()
                .success(true)
                .data(reportResponse)
                .timestamp(java.time.Instant.now())
                .build());
    }

    @GetMapping("/promotions/top")
    @Operation(summary = "Top promotions les plus performantes")
    public ResponseEntity<StatisticsResponse<List<TopPromotionDto>>> getTopPromotions(
            @Parameter(description = "Nombre de résultats")
            @RequestParam(defaultValue = "10") int limit,

            @Parameter(description = "Critère de tri")
            @RequestParam(defaultValue = "activations") String sortBy) {

        List<TopPromotionDto> topPromotions = statisticsService.getTopPromotions(limit, sortBy);

        return ResponseEntity.ok(StatisticsResponse.<List<TopPromotionDto>>builder()
                .success(true)
                .data(topPromotions)
                .timestamp(java.time.Instant.now())
                .build());
    }