package com.codewithamina.gestionpromo.service;


import com.codewithamina.gestionpromo.model.ActivationPromotion;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.request.CreatePromotionRequest;
import com.codewithamina.gestionpromo.request.UpdatePromotionRequest;

import java.math.BigDecimal;
import java.util.List;


public interface PromotionService {
    List<Promotion> getAutomaticPromotions(Client client, BigDecimal montantRecharge);
    ActivationPromotion activatePromotion(Client client, Promotion promotion, BigDecimal montantRecharge);
    List<Promotion> getAllPromotions(boolean activeOnly);
    Promotion findByCode(String code);
    Promotion createPromotion(CreatePromotionRequest request);
    Promotion updatePromotion(String code, UpdatePromotionRequest request);
    void deactivatePromotion(String code);

}