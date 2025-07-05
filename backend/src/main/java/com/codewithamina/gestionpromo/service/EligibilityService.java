package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.EligibilityResult;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;

import java.util.List;
public interface EligibilityService {
    List<Promotion> getEligiblePromotions(Client client);
    boolean isEligible(Client client, Promotion promotion);
    EligibilityResult checkEligibilityDetailed(Client client, Promotion promotion);
}