package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.exception.DuplicatePromotionCodeException;
import com.codewithamina.gestionpromo.model.ActivationPromotion;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.ActivationPromotionRepository;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import com.codewithamina.gestionpromo.request.CreatePromotionRequest;
import com.codewithamina.gestionpromo.request.UpdatePromotionRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
    public List<Promotion> getAllPromotions(boolean activeOnly) {
        if (activeOnly) {
            return promotionRepository.findByActiveTrue();
        } else {
            return promotionRepository.findAll();
        }
    }

    @Override
    public List<Promotion> getAutomaticPromotions(Client client, BigDecimal montantRecharge) {
        List<Promotion> allPromos = promotionRepository.findAllActiveAutomaticPromotions();
        if (allPromos == null) {
            allPromos = Collections.emptyList();
        }

        return allPromos.stream()
                .filter(promo -> eligibilityService.isEligible(client, promo))
                .collect(Collectors.toList());
    }

    @Override
    public ActivationPromotion activatePromotion(Client client, Promotion promotion, BigDecimal montantRecharge) {
        if (promotion.getDureeValidite() == null && promotion.getDateFin() == null) {
            throw new IllegalArgumentException("Promotion must have either duration or end date");
        }

        ActivationPromotion activation = new ActivationPromotion();
        activation.setClient(client);
        activation.setPromotion(promotion);
        activation.setDateActivation(LocalDateTime.now());
        activation.setMontantRecharge(montantRecharge);
        activation.setStatut("ACTIVE");

        // Set expiration date
        LocalDateTime expirationDate = promotion.getDureeValidite() != null
                ? LocalDateTime.now().plusDays(promotion.getDureeValidite())
                : promotion.getDateFin();
        activation.setDateExpiration(expirationDate);

        return activationPromotionRepository.save(activation);
    }



    @Override
    public Promotion createPromotion(CreatePromotionRequest request) {
        Optional<Promotion> existing = promotionRepository.findByCodePromotion(request.getCodePromotion());

        if (existing.isPresent()) {
            throw new DuplicatePromotionCodeException("Code promotion déjà utilisé : " + request.getCodePromotion());
        }

        Promotion promotion = new Promotion();
        promotion.setCodePromotion(request.getCodePromotion());
        promotion.setDescription(request.getDescription());

        // Conversion LocalDate (request) -> LocalDateTime (model), à minuit
        if (request.getDateDebut() != null) {
            promotion.setDateDebut(request.getDateDebut().atStartOfDay());
        } else {
            promotion.setDateDebut(null);
        }

        if (request.getDateFin() != null) {
            promotion.setDateFin(request.getDateFin().atStartOfDay());
        } else {
            promotion.setDateFin(null);
        }

        promotion.setActive(true);

        return promotionRepository.save(promotion);
    }


    @Override
    public Promotion findByCode(String code) {
        return promotionRepository.findByCodePromotion(code)
                .orElseThrow(() -> new RuntimeException("Promotion non trouvée avec le code : " + code));
    }

    @Override
    public Promotion updatePromotion(String code, UpdatePromotionRequest request) {
        Promotion promotion = findByCode(code);
        promotion.setDescription(request.getDescription());
        promotion.setDateDebut(request.getDateDebut());
        promotion.setDateFin(request.getDateFin());
        return promotionRepository.save(promotion);
    }

    @Override
    public void deactivatePromotion(String code) {
        Promotion promotion = findByCode(code);
        promotion.setActive(false);
        promotionRepository.save(promotion);
    }


}
