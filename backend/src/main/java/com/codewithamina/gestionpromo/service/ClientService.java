package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Client;

import java.time.LocalDate;
import java.util.List;

public interface ClientService {
    List<Client> searchClients(String numeroTelephone, String prenom, String nom, String email, String categorieClient);
    Client getClientById(Long clientId);
    void assignPromotionToClient(Long clientId, Long promotionId, LocalDate dateDebut, LocalDate dateFin);
}