package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.ActivationPromotion;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.ActivationRepository;
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
    private final ActivationRepository activationRepository;


    public ClientServiceImpl(ClientRepository clientRepository,
                             PromotionRepository promotionRepository,
                             ActivationRepository activationRepository) {
        this.clientRepository = clientRepository;
        this.promotionRepository = promotionRepository;
        this.activationRepository = activationRepository;
    }

    @Override
    public List<Client> searchClients(String numeroTelephone, String prenom,
                                      String nom, String email, String categorieClient) {
        return clientRepository.findByCriteria(
                numeroTelephone,
                prenom,
                nom,
                email,
                categorieClient
        );
    }

    public String getCategorieClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .map(Client::getCategorieClient)
                .orElse(null);
    }

    @Override
    public Client getClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + clientId));
    }

    @Override
    @Transactional
    public void assignPromotionToClient(Long clientId, Long promotionId,
                                        LocalDate dateDebut, LocalDate dateFin) {

        if (dateFin == null) {
            throw new IllegalArgumentException("Date de fin ne peut pas être nulle");
        }

        boolean exists = activationRepository.existsByClientIdAndPromotionIdAndDateExpirationAfter(
                clientId, promotionId, LocalDate.now());
        if (exists) {
            throw new IllegalStateException("Cette promotion est déjà active pour ce client");
        }

        Client client = getClientById(clientId);
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion non trouvée avec l'ID: " + promotionId));

        if (dateDebut.isBefore(promotion.getDateDebut())) {
            throw new IllegalArgumentException("La date d'activation ne peut pas être avant le début de la promotion");
        }
        if (dateFin.isAfter(promotion.getDateFin())) {
            throw new IllegalArgumentException("La date d'expiration ne peut pas être après la fin de la promotion");
        }

        ActivationPromotion activation = new ActivationPromotion();
        activation.setClient(client);
        activation.setPromotion(promotion);
        activation.setDateActivation(dateDebut);
        activation.setDateExpiration(dateFin);

        activationRepository.save(activation);
    }
    @Override
    public List<Promotion> getAvailablePromotionsForDateRange(Long clientId, LocalDate dateDebut, LocalDate dateFin) {
        if (dateDebut == null || dateFin == null) {
            throw new IllegalArgumentException("Les dates de début et de fin sont obligatoires");
        }

        if (dateDebut.isAfter(dateFin)) {
            throw new IllegalArgumentException("La date de début ne peut pas être après la date de fin");
        }

        // Récupérer la catégorie du client
        String categorieClient = getCategorieClientById(clientId);

        if (categorieClient == null) {
            throw new RuntimeException("Client non trouvé avec l'ID: " + clientId);
        }

        return promotionRepository.findAvailablePromotionsForClientAndDateRange(
                categorieClient, clientId, dateDebut, dateFin);
    }
}
