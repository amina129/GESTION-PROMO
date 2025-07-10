package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.PromotionAssignmentDto;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.ClientRepository;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final PromotionRepository promotionRepository;

    public ClientServiceImpl(ClientRepository clientRepository,
                             PromotionRepository promotionRepository) {
        this.clientRepository = clientRepository;
        this.promotionRepository = promotionRepository;
    }

    @Override
    public List<Client> searchClients(String numeroTelephone, String prenom,
                                      String nom, String email, String categorieClient) {
        // Implementation
    }

    @Override
    public Client getClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
    }

    @Override
    @Transactional
    public void assignPromotionToClient(Long clientId, Long promotionId,
                                        LocalDate dateDebut, LocalDate dateFin) {
        Client client = getClientById(clientId);
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        // Add your business logic here
        client.getPromotions().add(promotion);
        clientRepository.save(client);
    }
}