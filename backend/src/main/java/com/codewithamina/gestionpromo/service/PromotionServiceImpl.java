package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.ActivationPromotion;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.ActivationPromotionRepository;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final EligibilityService eligibilityService;
    private final ActivationPromotionRepository activationPromotionRepository;

    public PromotionServiceImpl(PromotionRepository promotionRepository,
                                EligibilityService eligibilityService,
                                ActivationPromotionRepository activationPromotionRepository) {
        this.promotionRepository = promotionRepository;
        this.eligibilityService = eligibilityService;
        this.activationPromotionRepository = activationPromotionRepository;
    }

    @Override
    public List<Promotion> getAutomaticPromotions(Client client, BigDecimal montantRecharge) {
        List<Promotion> allPromos = promotionRepository.findAllActiveAutomaticPromotions();

        if (allPromos == null) {
            allPromos = Collections.emptyList();  // ne jamais retourner null
        }

        return allPromos.stream()
                .filter(promo -> eligibilityService.isEligible(client, promo))
                .collect(Collectors.toList());
    }


    @Override
    public void activatePromotion(Client client, Promotion promotion, BigDecimal montantRecharge) {
        ActivationPromotion activation = new ActivationPromotion();
        activation.setClient(client);
        activation.setPromotion(promotion);
        activation.setDateActivation(LocalDateTime.now());

        if (promotion.getDureeValidite() != null) {
            activation.setDateExpiration(LocalDateTime.now().plusDays(promotion.getDureeValidite()));
        }

        activation.setMontantRecharge(montantRecharge);
        activation.setStatut("ACTIVE");

        activationPromotionRepository.save(activation);

        System.out.printf("Promotion %d activée pour client %s avec recharge %s%n",
                promotion.getId(), client.getNumeroTelephone(), montantRecharge.toPlainString());
    }
}
