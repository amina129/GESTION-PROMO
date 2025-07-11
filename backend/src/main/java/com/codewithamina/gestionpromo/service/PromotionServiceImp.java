package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PromotionServiceImp implements PromotionService {
    private final PromotionRepository promotionRepository;

    public PromotionServiceImp(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @Override
    public List<Promotion> findByCategorieClient(String categorieClient) {
        LocalDate today = LocalDate.now();
        return promotionRepository.findAvailableByCategorieClient(categorieClient, today);
    }

    @Override
    public List<Promotion> findAvailablePromotionsForClient(Long clientId, String categorieClient) {
        return promotionRepository.findAvailableByCategorieClientAndClientId(categorieClient, clientId);
    }
}