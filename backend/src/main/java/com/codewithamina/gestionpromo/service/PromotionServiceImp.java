package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.repository.PromotionRepository;
import org.springframework.stereotype.Service;

@Service
public class PromotionServiceImp implements PromotionService {  // Implémente l'interface
    private final PromotionRepository promotionRepository;  // final pour l'immutabilité

    // Injection par constructeur (supprimez le constructeur vide inutile)
    public PromotionServiceImp(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    // Supprimez la méthode PromotionService() qui est incorrecte

}