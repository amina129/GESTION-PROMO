package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.repository.ActivationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final ActivationRepository activationRepository;

    public StatisticsService(ActivationRepository activationRepository) {
        this.activationRepository = activationRepository;
    }

    public Map<Long, Integer> getPromotionActivationCounts() {
        List<Object[]> results = activationRepository.countActivationsPerPromotion();

        return results.stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],  // Promotion ID
                        result -> ((Number) result[1]).intValue()  // Activation count
                ));
    }
}