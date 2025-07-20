package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.TopPromotionDto;
import com.codewithamina.gestionpromo.dto.TrendDataDto;
import com.codewithamina.gestionpromo.dto.TrendsDto;
import com.codewithamina.gestionpromo.repository.ActivationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final ActivationRepository activationRepository;

    // Suppression de getPromotionActivationCounts() qui utilisait countActivationsPerPromotion

    public List<TopPromotionDto> getTopActivatedPromotions(int limit) {
        // Utilise uniquement findTopPromotions avec Pageable
        List<Object[]> rows = activationRepository.findTopPromotions(PageRequest.of(0, limit));

        return rows.stream().map(row ->
                new TopPromotionDto(
                        // Ici on suppose que row[0] = p.id (Long) mais si tu préfères le nom, adapte la requête
                        String.valueOf(row[0]), // promoId converti en String (à adapter si tu récupères le nom)
                        (String) row[1],        // clientCategory
                        (String) row[2],        // promoType
                        ((Number) row[3]).intValue(),
                        0.0                     // Pas de revenue dans ta table
                )
        ).collect(Collectors.toList());
    }

    public TrendsDto getActivationsByFilters(String clientCategory, String promoType, String monthYear) {
        YearMonth yearMonth = YearMonth.parse(monthYear, java.time.format.DateTimeFormatter.ofPattern("MM/yyyy"));
        int year = yearMonth.getYear();
        int month = yearMonth.getMonthValue();

        List<Object[]> results = activationRepository.findMonthlyActivations(clientCategory, promoType, year, month);

        List<TrendDataDto> trends = results.stream()
                .map(row -> new TrendDataDto(
                        (String) row[0], // e.g. "Jan", "Fév"
                        ((Number) row[1]).intValue()
                ))
                .collect(Collectors.toList());

        return TrendsDto.builder()
                .period(monthYear)
                .metric("activations")
                .trends(trends)
                .build();
    }
}
