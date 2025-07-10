package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.ClientDTO;
import com.codewithamina.gestionpromo.dto.*;
import com.codewithamina.gestionpromo.model.*;
import com.codewithamina.gestionpromo.exception.ClientNotFoundException;
import com.codewithamina.gestionpromo.mapper.*;
import com.codewithamina.gestionpromo.request.BalanceUpdateRequest;
import com.codewithamina.gestionpromo.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClientController {

    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);

    private final ClientService clientService;
    private final PromotionService promotionService;
    private final EligibilityService eligibilityService;

    @Autowired
    public ClientController(ClientService clientService,
                            PromotionService promotionService,
                            EligibilityService eligibilityService) {
        this.clientService = clientService;
        this.promotionService = promotionService;
        this.eligibilityService = eligibilityService;
    }

    // Get client by numero_telephone
    @GetMapping("/{numeroTelephone}")
    public ResponseEntity<ClientDTO> getClient(@PathVariable String numeroTelephone) {
        try {
            Client client = clientService.findByNumeroTelephone(numeroTelephone);
            ClientDTO clientDTO = ClientMapper.toDTO(client);
            return ResponseEntity.ok(clientDTO);

        } catch (ClientNotFoundException e) {
            logger.warn("Client not found for phone: {}", numeroTelephone);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error finding client with phone {}: {}", numeroTelephone, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get client's eligible promotions
    @GetMapping("/{numeroTelephone}/eligible-promotions")
    public ResponseEntity<List<PromotionDTO>> getEligiblePromotions(@PathVariable String numeroTelephone) {
        try {
            logger.info("Fetching eligible promotions for client: {}", numeroTelephone);

            Client client = clientService.findByNumeroTelephone(numeroTelephone);
            List<Promotion> eligiblePromotions = eligibilityService.getEligiblePromotions(client);

            List<PromotionDTO> promotionDTOs = eligiblePromotions.stream()
                    .map(PromotionMapper::toDTO)
                    .collect(Collectors.toList());

            logger.info("Found {} eligible promotions for client: {}", promotionDTOs.size(), numeroTelephone);
            return ResponseEntity.ok(promotionDTOs);

        } catch (ClientNotFoundException e) {
            logger.warn("Client not found for eligible promotions request: {}", numeroTelephone);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error fetching eligible promotions for client {}: {}", numeroTelephone, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update client balance (for recharge simulation)
    @PutMapping("/{numeroTelephone}/balance")
    public ResponseEntity<ClientDTO> updateBalance(
            @PathVariable String numeroTelephone,
            @RequestBody BalanceUpdateRequest request) {
        try {
            logger.info("Updating balance for client: {} with amount: {}", numeroTelephone, request.getMontant());

            Client client = clientService.updateBalance(numeroTelephone, request.getMontant());

            // Check for automatic promotions after recharge
            List<Promotion> autoPromotions = promotionService.getAutomaticPromotions(client, request.getMontant());
            logger.info("Found {} automatic promotions for client: {}", autoPromotions.size(), numeroTelephone);

            // Activate eligible automatic promotions
            int activatedCount = 0;
            for (Promotion promo : autoPromotions) {
                if (eligibilityService.isEligible(client, promo)) {
                    promotionService.activatePromotion(client, promo, request.getMontant());
                    activatedCount++;
                    logger.info("Activated promotion {} for client: {}", promo.getId(), numeroTelephone);
                }
            }

            logger.info("Activated {} automatic promotions for client: {}", activatedCount, numeroTelephone);
            return ResponseEntity.ok(ClientMapper.toDTO(client));

        } catch (ClientNotFoundException e) {
            logger.warn("Client not found for balance update: {}", numeroTelephone);
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid balance update request for client {}: {}", numeroTelephone, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error updating balance for client {}: {}", numeroTelephone, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get client's active promotions
    @GetMapping("/{numeroTelephone}/active-promotions")
    public ResponseEntity<List<ActivationPromotionDTO>> getActivePromotions(@PathVariable String numeroTelephone) {
        try {
            logger.info("Fetching active promotions for client: {}", numeroTelephone);

            List<ActivationPromotion> activePromotions = clientService.getActivePromotions(numeroTelephone);
            List<ActivationPromotionDTO> promotionDTOs = activePromotions.stream()
                    .map(ActivationPromotionMapper::toDTO)
                    .collect(Collectors.toList());

            logger.info("Found {} active promotions for client: {}", promotionDTOs.size(), numeroTelephone);
            return ResponseEntity.ok(promotionDTOs);

        } catch (ClientNotFoundException e) {
            logger.warn("Client not found for active promotions request: {}", numeroTelephone);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error fetching active promotions for client {}: {}", numeroTelephone, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Search clients with flexible phone number matching
    @GetMapping("/search")
    public ResponseEntity<List<ClientDTO>> searchClients(
            @RequestParam(required = false) String numeroTelephone,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String codeClient,
            @RequestParam(required = false) String typeAbonnement,
            @RequestParam(required = false) String statut,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        try {
            logger.info("Searching clients with filters - phone: {}, nom: {}, prenom: {}, email: {}, code: {}, type: {}, statut: {}, page: {}, size: {}",
                    numeroTelephone, nom, prenom, email, codeClient, typeAbonnement, statut, page, size);

            if (size > 100) {
                size = 100; // Limit maximum page size
            }

            Pageable pageable = PageRequest.of(page, size);
            Page<Client> clients = clientService.searchClients(numeroTelephone, nom, prenom, email,
                    codeClient, typeAbonnement, statut, pageable);

            List<ClientDTO> clientDTOs = clients.getContent().stream()
                    .map(ClientMapper::toDTO)
                    .collect(Collectors.toList());

            logger.info("Found {} clients matching search criteria", clientDTOs.size());
            return ResponseEntity.ok(clientDTOs);

        } catch (Exception e) {
            logger.error("Error searching clients: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get client by code_client
    @GetMapping("/code/{codeClient}")
    public ResponseEntity<ClientDTO> getClientByCode(@PathVariable String codeClient) {
        try {
            logger.info("Searching for client with code: {}", codeClient);

            Client client = clientService.findByCodeClient(codeClient);
            ClientDTO clientDTO = ClientMapper.toDTO(client);

            logger.info("Client found successfully for code: {}", codeClient);
            return ResponseEntity.ok(clientDTO);

        } catch (ClientNotFoundException e) {
            logger.warn("Client not found for code: {}", codeClient);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error finding client with code {}: {}", codeClient, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper endpoint to debug - shows all phone numbers in database (should be removed in production)
    @GetMapping("/debug/phones")
    public ResponseEntity<List<String>> getAllPhoneNumbers() {
        try {
            logger.warn("Debug endpoint accessed - getAllPhoneNumbers");

            List<String> phones = clientService.getAllPhoneNumbers();
            return ResponseEntity.ok(phones);

        } catch (Exception e) {
            logger.error("Error fetching all phone numbers: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
