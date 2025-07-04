package com.codewithamina.gestionpromo.service;


import com.codewithamina.gestionpromo.entity.Client;
import com.codewithamina.gestionpromo.entity.Promotion;

import java.math.BigDecimal;
import java.util.List;


public interface PromotionService {
    List<Promotion> getAutomaticPromotions(Client client, BigDecimal montantRecharge);
    void activatePromotion(Client client, Promotion promotion, BigDecimal montantRecharge);
}