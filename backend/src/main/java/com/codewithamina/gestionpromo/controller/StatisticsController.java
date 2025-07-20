package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.StatisticsResponse;
import com.codewithamina.gestionpromo.dto.TopPromotionDto;
import com.codewithamina.gestionpromo.dto.TrendsDto;
import com.codewithamina.gestionpromo.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * Endpoint used by React: fetchTopPromos()
     */
    @GetMapping("/promotions/top")
    public ResponseEntity<StatisticsResponse<List<TopPromotionDto>>> getTopPromotions(
            @RequestParam(defaultValue = "5") int limit
            // Suppression de sortBy qui n'est plus utilisé
    ) {
        List<TopPromotionDto> topPromotions = statisticsService.getTopActivatedPromotions(limit);

        return ResponseEntity.ok(StatisticsResponse.<List<TopPromotionDto>>builder()
                .success(true)
                .timestamp(Instant.now())
                .data(topPromotions)
                .build());
    }

    /**
     * Endpoint used by React: fetchStatistics()
     */
    @GetMapping("/promotions/activations")
    public ResponseEntity<StatisticsResponse<TrendsDto>> getPromotionActivations(
            @RequestParam String clientCategory,
            @RequestParam String promoType,
            @RequestParam String monthYear) {

        TrendsDto trends = statisticsService.getActivationsByFilters(clientCategory, promoType, monthYear);

        return ResponseEntity.ok(StatisticsResponse.<TrendsDto>builder()
                .success(true)
                .timestamp(Instant.now())
                .data(trends)
                .build());
    }
}
