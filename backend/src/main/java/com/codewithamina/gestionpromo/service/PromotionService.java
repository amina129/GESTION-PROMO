package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Promotion;

import java.util.List;

public interface PromotionService {
    List<Promotion> findByCategorieClient(String categorieClient);
    Promotion prolongerPromotion(Long promotionId, String nouvelleDateFin);
    Promotion etendreCategories(Long promotionId, List<String> nouvellesCategories);
    Promotion getPromotionWithCategories(Long id);
}