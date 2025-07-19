package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.AssignedPromotionDto;
import com.codewithamina.gestionpromo.model.ActivationPromotion;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.ActivationRepository;
import com.codewithamina.gestionpromo.repository.ClientRepository;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public Client getClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + clientId));
    }

    @Override
    public List<Client> searchClients(Long currentUserId, String userRole, String numeroTelephone,
                                      String prenom, String nom, String email, String categorieClient) {
        return clientRepository.findByCriteriaWithRoleCheck(
                currentUserId,
                userRole,
                numeroTelephone,
                prenom,
                nom,
                email,
                categorieClient
        );
    }
    @Override
    @Transactional
    public void extendPromotionValidity(Long clientId, Long activationId, LocalDate newDateFin) {
        ActivationPromotion activation = activationRepository.findById(activationId)
                .orElseThrow(() -> new IllegalArgumentException("Activation non trouvée avec l'ID: " + activationId));

        // Vérifier que l'activation appartient bien au client
        if (!activation.getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("Cette activation ne correspond pas au client spécifié");
        }

        // Vérifier que la nouvelle date est après l'ancienne date de fin
        if (!newDateFin.isAfter(activation.getDateExpiration())) {
            throw new IllegalArgumentException("La nouvelle date de fin doit être après l'ancienne date de fin");
        }

        // Vérifier que la nouvelle date ne dépasse pas la date de fin de la promotion
        if (newDateFin.isAfter(activation.getPromotion().getDateFin())) {
            throw new IllegalArgumentException("La nouvelle date de fin ne peut pas dépasser la date de fin de la promotion");
        }

        activation.setDateExpiration(newDateFin);
        activationRepository.save(activation);
    }
    @Override
    @Transactional
    public void cancelAssignedPromotions(Long clientId, List<Long> activationIds) {
        if (activationIds == null || activationIds.isEmpty()) {
            throw new IllegalArgumentException("Aucune promotion sélectionnée pour annulation");
        }

        // On vérifie que les activations existent et appartiennent bien au client
        List<ActivationPromotion> activations = activationRepository.findAllById(activationIds);

        for (ActivationPromotion activation : activations) {
            if (!activation.getClient().getId().equals(clientId)) {
                throw new IllegalArgumentException("Une ou plusieurs promotions ne sont pas liées à ce client");
            }
        }

        activationRepository.deleteAll(activations);
    }

    @Override
    public List<AssignedPromotionDto> getAssignedPromotions(Long clientId) {
        // Vérifier que le client existe
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé avec l'ID: " + clientId));

        // Récupérer toutes les activations du client
        List<ActivationPromotion> activations = activationRepository.findByClientId(clientId);

        LocalDate today = LocalDate.now();

        // Mapper vers DTO et trier
        return activations.stream()
                .map(activation -> {
                    Promotion promotion = activation.getPromotion();

                    // Déterminer le statut
                    String statut;
                    Integer joursRestants = null;

                    if (activation.getDateActivation().isAfter(today)) {
                        statut = "UPCOMING";
                    } else if (activation.getDateExpiration().isBefore(today)) {
                        statut = "EXPIRED";
                    } else {
                        statut = "ACTIVE";
                        joursRestants = (int) ChronoUnit.DAYS.between(today, activation.getDateExpiration());
                    }

                    return new AssignedPromotionDto(
                            activation.getId(),
                            promotion.getId(),
                            promotion.getNom(),
                            promotion.getDescription(),
                            promotion.getType(),
                            promotion.getSousType(),
                            promotion.getValeur(),
                            promotion.getTypeUnite(),
                            promotion.getUniteMesure(),
                            activation.getDateActivation(),
                            activation.getDateExpiration(),
                            statut,
                            joursRestants
                    );
                })
                // Trier: ACTIVE en premier, puis UPCOMING, puis EXPIRED
                .sorted((a, b) -> {
                    if (a.getStatut().equals(b.getStatut())) {
                        // Même statut: trier par date d'expiration
                        return a.getDateExpiration().compareTo(b.getDateExpiration());
                    }
                    // Différent statut: ordre prioritaire
                    Map<String, Integer> priorite = Map.of(
                            "ACTIVE", 1,
                            "UPCOMING", 2,
                            "EXPIRED", 3
                    );
                    return priorite.get(a.getStatut()).compareTo(priorite.get(b.getStatut()));
                })
                .collect(Collectors.toList());
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

        String categorieClient = clientRepository.findById(clientId)
                .map(Client::getCategorieClient)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + clientId));

        return promotionRepository.findAvailablePromotionsForClientAndDateRange(
                categorieClient, clientId, dateDebut, dateFin);
    }
}