package com.codewithamina.gestionpromo.service;


import com.codewithamina.gestionpromo.model.Promotion;

import java.util.List;

public interface PromotionService {
    List<Promotion> findByCategorieClient(String categorieClient);
    List<Promotion> findAvailablePromotionsForClient(Long clientId, String categorieClient);

}