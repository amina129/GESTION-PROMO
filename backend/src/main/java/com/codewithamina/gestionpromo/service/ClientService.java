package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.ActivationPromotion;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.CompteFidelite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ClientService {
    Client findByNumeroTelephone(String numeroTelephone);
    Client findByCodeClient(String codeClient);
    Client updateBalance(String numeroTelephone, BigDecimal montant);
    List<ActivationPromotion> getActivePromotions(String numeroTelephone);
    CompteFidelite getLoyaltyAccount(String numeroTelephone);
    Page<Client> searchClients(String numeroTelephone, String nom, String prenom, String email,
                               String codeClient, String typeAbonnement, String statut, Pageable pageable);
    List<String> getAllPhoneNumbers();
}
