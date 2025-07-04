package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.entity.Client;
import com.codewithamina.gestionpromo.entity.Promotion;

import java.util.List;
public interface EligibilityService {
    List<Promotion> getEligiblePromotions(Client client);
    boolean isEligible(Client client, Promotion promotion);
}