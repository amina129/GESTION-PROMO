package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.entity.ActivationPromotion;
import com.codewithamina.gestionpromo.entity.Client;
import com.codewithamina.gestionpromo.entity.CompteFidelite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    @Override
    public Client findByNumeroTelephone(String numeroTelephone) {
        // TODO: implémenter la recherche client par numéro
        return null;
    }

    @Override
    public Client findByCodeClient(String codeClient) {
        // TODO: implémenter la recherche client par code
        return null;
    }

    @Override
    public Client updateBalance(String numeroTelephone, BigDecimal montant) {
        // TODO: implémenter la mise à jour du solde client
        return null;
    }

    @Override
    public List<ActivationPromotion> getActivePromotions(String numeroTelephone) {
        // TODO: implémenter récupération promotions actives
        return null;
    }

    @Override
    public CompteFidelite getLoyaltyAccount(String numeroTelephone) {
        // TODO: implémenter récupération compte fidélité
        return null;
    }

    @Override
    public Page<Client> searchClients(String numeroTelephone, String nom, String prenom, String email,
                                      String codeClient, String typeAbonnement, String statut, Pageable pageable) {
        // TODO: implémenter recherche clients
        return null;
    }

    @Override
    public List<String> getAllPhoneNumbers() {
        // TODO: implémenter récupération de tous les numéros
        return null;
    }
}
