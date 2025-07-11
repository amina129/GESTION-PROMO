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

    @Override
    public Client getClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + clientId));
    }

    @Override
    @Transactional
    public void assignPromotionToClient(Long clientId, Long promotionId,
                                        LocalDate dateDebut, LocalDate dateFin) {

        // Vérifier que dateFin est non nulle
        if (dateFin == null) {
            throw new IllegalArgumentException("Date de fin ne peut pas être nulle");
        }

        // 1. Vérifier si la promotion est déjà active pour ce client
        boolean exists = activationRepository.existsByClientIdAndPromotionIdAndDateExpirationAfter(
                clientId, promotionId, LocalDate.now());
        if (exists) {
            throw new IllegalStateException("Cette promotion est déjà active pour ce client");
        }

        // 2. Charger client et promotion depuis la base
        Client client = getClientById(clientId);
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion non trouvée avec l'ID: " + promotionId));

        // 3. Valider les dates d'activation/expiration
        if (dateDebut.isBefore(promotion.getDateDebut())) {
            throw new IllegalArgumentException("La date d'activation ne peut pas être avant le début de la promotion");
        }
        if (dateFin.isAfter(promotion.getDateFin())) {
            throw new IllegalArgumentException("La date d'expiration ne peut pas être après la fin de la promotion");
        }

        // 4. Créer et sauvegarder l'activation
        ActivationPromotion activation = new ActivationPromotion();
        activation.setClient(client);
        activation.setPromotion(promotion);
        activation.setDateActivation(dateDebut);
        activation.setDateExpiration(dateFin);

        activationRepository.save(activation);
    }
}