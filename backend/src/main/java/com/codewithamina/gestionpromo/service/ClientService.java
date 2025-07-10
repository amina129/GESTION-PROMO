package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClientService {
    Client findByNumeroTelephone(String numeroTelephone);
    Client findByCodeClient(String codeClient);
    Page<Client> searchClients(String numeroTelephone, String nom, String prenom, String email,
                               String codeClient, String typeAbonnement, String statut, Pageable pageable);
}
