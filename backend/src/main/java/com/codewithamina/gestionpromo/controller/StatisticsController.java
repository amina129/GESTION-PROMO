package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.StatisticsResponse;
import com.codewithamina.gestionpromo.dto.TrendsDto;
import com.codewithamina.gestionpromo.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/stats/promotions")
    public ResponseEntity<Map<Long, Integer>> getPromotionStats() {
        Map<Long, Integer> stats = statisticsService.getPromotionActivationCounts();
        return ResponseEntity.ok(stats);
    }


    @GetMapping("/trends")
    public ResponseEntity<StatisticsResponse<TrendsDto>> getTrends(
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam(defaultValue = "activations") String metric) {


        return ResponseEntity.ok(StatisticsResponse.<TrendsDto>builder()
                .success(true)
                .timestamp(Instant.now())
                .build());
    }

    /*@PostMapping("/export-report")
    public ResponseEntity<StatisticsResponse<ExportReportResponse>> exportReport(
            @Valid @RequestBody ExportReportRequest request) {


        return ResponseEntity.ok(StatisticsResponse.<ExportReportResponse>builder()
                .success(true)
                .timestamp(Instant.now())
                .build());
    }

    @GetMapping("/promotions/top")
    public ResponseEntity<StatisticsResponse<List<TopPromotionDto>>> getTopPromotions(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "activations") String sortBy) {


        return ResponseEntity.ok(StatisticsResponse.<List<TopPromotionDto>>builder()
                .success(true)
                .timestamp(Instant.now())
                .build());
    }*/
}
