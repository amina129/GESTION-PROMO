package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.entity.Client;
import com.codewithamina.gestionpromo.entity.Promotion;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EligibilityServiceImpl implements EligibilityService {

    @Override
    public List<Promotion> getEligiblePromotions(Client client) {
        // TODO: implémenter la logique pour retourner la liste des promotions éligibles pour le client
        return null;
    }

    @Override
    public boolean isEligible(Client client, Promotion promotion) {
        // TODO: implémenter la logique pour vérifier si un client est éligible à une promotion donnée
        return false;
    }
}
