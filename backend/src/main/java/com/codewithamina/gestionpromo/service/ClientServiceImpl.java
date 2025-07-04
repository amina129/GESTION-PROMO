package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.ActivationPromotion;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.CompteFidelite;
import com.codewithamina.gestionpromo.exception.ClientNotFoundException;
import com.codewithamina.gestionpromo.repository.ActivationPromotionRepository;
import com.codewithamina.gestionpromo.repository.ClientRepository;
import com.codewithamina.gestionpromo.repository.CompteFideliteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ActivationPromotionRepository activationPromotionRepository;

    @Autowired
    private CompteFideliteRepository compteFideliteRepository;

    @Override
    public Client findByNumeroTelephone(String numeroTelephone) {
        return clientRepository.findByNumeroTelephone(numeroTelephone)
                .orElseThrow(() -> new ClientNotFoundException("Client non trouvé avec le numéro : " + numeroTelephone));
    }

    @Override
    public Client findByCodeClient(String codeClient) {
        return clientRepository.findByCodeClient(codeClient)
                .orElseThrow(() -> new ClientNotFoundException("Client non trouvé avec le code : " + codeClient));
    }

    @Override
    @Transactional
    public Client updateBalance(String numeroTelephone, BigDecimal montant) {
        Client client = findByNumeroTelephone(numeroTelephone);

        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être supérieur à zéro");
        }

        client.setSolde(client.getSolde().add(montant));
        client.setDerniereRecharge(LocalDateTime.now());

        return clientRepository.save(client);
    }

    @Override
    public List<ActivationPromotion> getActivePromotions(String numeroTelephone) {
        Client client = findByNumeroTelephone(numeroTelephone);
        Long clientId = client.getId();

        return activationPromotionRepository.findByClient_IdAndStatut(clientId, "ACTIVE");


    }

    @Override
    public CompteFidelite getLoyaltyAccount(String numeroTelephone) {
        Client client = findByNumeroTelephone(numeroTelephone);
        return compteFideliteRepository.findByClientId(client.getId())
                .orElseThrow(() -> new ClientNotFoundException("Compte fidélité introuvable pour le client"));
    }

    @Override
    public Page<Client> searchClients(String numeroTelephone, String nom, String prenom, String email,
                                      String codeClient, String typeAbonnement, String statut, Pageable pageable) {
        return clientRepository.searchClients(numeroTelephone, nom, prenom, email,
                codeClient, typeAbonnement, statut, pageable);
    }

    @Override
    public List<String> getAllPhoneNumbers() {
        return clientRepository.findAllPhoneNumbers();
    }

    // Pour pouvoir enregistrer un client via POST
    public Client save(Client client) {
        return clientRepository.save(client);
    }
}
