package com.codewithamina.gestionpromo.mapper;

import com.codewithamina.gestionpromo.dto.ClientDTO;
import com.codewithamina.gestionpromo.model.Client;

public class ClientMapper {
    public static ClientDTO toDTO(Client client) {
        if (client == null) return null;

        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setNumeroTelephone(client.getNumeroTelephone());
        dto.setCodeClient(client.getCodeClient());
        dto.setNom(client.getNom());
        dto.setPrenom(client.getPrenom());
        dto.setEmail(client.getEmail());
        dto.setTypeAbonnement(client.getTypeAbonnement());
        dto.setStatut(client.getStatut());
        dto.setSolde(client.getSolde());
        dto.setDerniereRecharge(client.getDerniereRecharge());
        return dto;
    }

    public static Client toEntity(ClientDTO dto) {
        if (dto == null) return null;

        Client client = new Client();
        client.setId(dto.getId());
        client.setNumeroTelephone(dto.getNumeroTelephone());
        client.setCodeClient(dto.getCodeClient());
        client.setNom(dto.getNom());
        client.setPrenom(dto.getPrenom());
        client.setEmail(dto.getEmail());
        client.setTypeAbonnement(dto.getTypeAbonnement());
        client.setStatut(dto.getStatut());
        client.setSolde(dto.getSolde());
        client.setDerniereRecharge(dto.getDerniereRecharge());
        return client;
    }
}