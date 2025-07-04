package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.entity.Client;
import com.codewithamina.gestionpromo.entity.Promotion;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PromotionServiceImpl implements PromotionService {

    @Override
    public List<Promotion> getAutomaticPromotions(Client client, BigDecimal montantRecharge) {
        // TODO: implémenter la logique pour récupérer les promotions automatiques selon client et montant
        return null;
    }

    @Override
    public void activatePromotion(Client client, Promotion promotion, BigDecimal montantRecharge) {
        // TODO: implémenter la logique pour activer une promotion pour le client
    }
}
