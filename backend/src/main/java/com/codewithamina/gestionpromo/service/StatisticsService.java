package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.ClientRepository;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticsService {

    private final PromotionRepository promotionRepository;
    private final ClientRepository clientRepository;

    public List<PromotionStatisticsDto> getPromotionStatistics(
            String month, String clientCategory, String promoType,
            LocalDate startDate, LocalDate endDate) {

        log.info("Récupération des statistiques promotions - Filtres: month={}, category={}, type={}",
                month, clientCategory, promoType);

        List<Promotion> promotions = promotionRepository.findWithFilters(
                month, clientCategory, promoType, startDate, endDate);

        return promotions.stream()
                .collect(Collectors.groupingBy(
                        p -> new PromotionKey(p.getPromoName(), p.getClientCategory(), p.getPromoType()),
                        Collectors.summingInt(Promotion::getActivations),
                        Collectors.summingDouble(Promotion::getRevenue)
                ))
                .entrySet().stream()
                .map(entry -> PromotionStatisticsDto.builder()
                        .promoName(entry.getKey().getPromoName())
                        .clientCategory(entry.getKey().getClientCategory())
                        .promoType(entry.getKey().getPromoType())
                        .totalActivations(entry.getValue().getActivations())
                        .totalRevenue(entry.getValue().getRevenue())
                        .build())
                .sorted((a, b) -> Integer.compare(b.getTotalActivations(), a.getTotalActivations()))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "dashboard-stats", unless = "#result == null")
    public DashboardStatsDto getDashboardStats() {
        log.info("Calcul des statistiques dashboard");

        long totalPromotions = promotionRepository.count();
        long totalClients = clientRepository.count();
        int totalActivations = promotionRepository.sumAllActivations();
        double totalRevenue = promotionRepository.sumAllRevenue();

        List<MonthlyStatsDto> monthlyStats = promotionRepository.getMonthlyStats();

        return DashboardStatsDto.builder()
                .overview(OverviewDto.builder()
                        .totalPromotions(totalPromotions)
                        .totalClients(totalClients)
                        .totalActivations(totalActivations)
                        .totalRevenue(totalRevenue)
                        .build())
                .monthlyTrends(monthlyStats)
                .build();
    }

    public TrendsDto getTrends(String period, String metric) {
        log.info("Analyse des tendances - période: {}, métrique: {}", period, metric);

        List<TrendDataDto> trends = switch (period) {
            case "daily" -> promotionRepository.getDailyTrends();
            case "weekly" -> promotionRepository.getWeeklyTrends();
            case "monthly" -> promotionRepository.getMonthlyTrends();
            default -> promotionRepository.getMonthlyTrends();
        };

        return TrendsDto.builder()
                .period(period)
                .metric(metric)
                .trends(trends)
                .build();
    }

    public List<TopPromotionDto> getTopPromotions(int limit, String sortBy) {
        log.info("Récupération du top {} promotions triées par {}", limit, sortBy);

        return switch (sortBy) {
            case "revenue" -> promotionRepository.findTopByRevenue(limit);
            case "activations" -> promotionRepository.findTopByActivations(limit);
            default -> promotionRepository.findTopByActivations(limit);
        };
    }

    public ExportReportResponse generateReport(ExportReportRequest request) {
        log.info("Génération de rapport - format: {}", request.getFormat());

        String content = switch (request.getFormat()) {
            case "email" -> generateEmailReport(request);
            case "pdf" -> generatePdfReport(request);
            case "csv" -> generateCsvReport(request);
            default -> generateEmailReport(request);
        };

        return ExportReportResponse.builder()
                .content(content)
                .reportId(generateReportId())
                .generatedAt(java.time.Instant.now())
                .format(request.getFormat())
                .build();
    }

    private String generateEmailReport(ExportReportRequest request) {
        StringBuilder report = new StringBuilder();
        report.append("Rapport Statistiques Promotions\n");
        report.append("================================\n\n");
        report.append("Période d'analyse: ").append(java.time.LocalDate.now()).append("\n\n");

        // Ajouter les filtres
        if (request.getFilters() != null) {
            report.append("Filtres appliqués:\n");
            if (request.getFilters().getMonth() != null) {
                report.append("- Mois: ").append(request.getFilters().getMonth()).append("\n");
            }
            if (request.getFilters().getClientCategory() != null) {
                report.append("- Catégorie: ").append(request.getFilters().getClientCategory()).append("\n");
            }
            report.append("\n");
        }

        // Ajouter les statistiques
        if (request.getStatistics() != null) {
            report.append("Résultats principaux:\n");
            report.append("- Total activations: ").append(request.getStatistics().getTotalActivations()).append("\n");
            report.append("- Chiffre d'affaires: ").append(String.format("%.2f€", request.getStatistics().getTotalRevenue())).append("\n");
            report.append("- Moyenne activations: ").append(request.getStatistics().getAverageActivations()).append("\n\n");
        }

        report.append("Rapport généré le ").append(java.time.LocalDateTime.now()).append("\n");

        return report.toString();
    }

    private String generateReportId() {
        return "RPT_" + System.currentTimeMillis() + "_" +
                java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generatePdfReport(ExportReportRequest request) {
        // Implémentation PDF avec iText ou autre
        return "PDF_CONTENT_BASE64_OR_URL";
    }

    private String generateCsvReport(ExportReportRequest request) {
        // Implémentation CSV
        return "CSV_CONTENT";
    }
}
