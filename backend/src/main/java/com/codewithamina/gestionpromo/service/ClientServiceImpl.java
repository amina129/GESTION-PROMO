package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.exception.ClientNotFoundException;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.repository.ActivationPromotionRepository;
import com.codewithamina.gestionpromo.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ActivationPromotionRepository activationPromotionRepository;
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
    public Page<Client> searchClients(String numeroTelephone, String nom, String prenom, String email,
                                      String codeClient, String typeAbonnement, String statut, Pageable pageable) {
        return clientRepository.searchClients(numeroTelephone, nom, prenom, email,
                codeClient, typeAbonnement, statut, pageable);
    }
}