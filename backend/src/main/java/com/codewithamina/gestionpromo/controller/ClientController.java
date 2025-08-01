package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.config.AdminDetails;
import com.codewithamina.gestionpromo.dto.AssignedPromotionDto;
import com.codewithamina.gestionpromo.dto.PromotionAssignmentDto;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Fonction;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<Client>> searchClients(
            Authentication authentication,
            @RequestParam(required = false) String numero_telephone,
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Long categorie_client  // déjà nullable Long
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            AdminDetails adminDetails = (AdminDetails) authentication.getPrincipal();
            Long currentUserId = adminDetails.getId();
            String userRole = (adminDetails.getFonction() == Fonction.ADMIN) ? "ADMIN" : "ADVISOR";

            // Nettoyer les Strings (pas le Long)
            numero_telephone = StringUtils.hasText(numero_telephone) ? numero_telephone : null;
            prenom = StringUtils.hasText(prenom) ? prenom : null;
            nom = StringUtils.hasText(nom) ? nom : null;
            email = StringUtils.hasText(email) ? email : null;
            // NE PAS TESTER categorie_client, il est déjà null si absent

            List<Client> clients = clientService.searchClients(
                    currentUserId,
                    userRole,
                    numero_telephone,
                    prenom,
                    nom,
                    email,
                    categorie_client
            );

            return ResponseEntity.ok(clients);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Ajouter cette méthode dans votre ClientController

    @GetMapping("/{clientId}/promotions/assigned")
    public ResponseEntity<List<AssignedPromotionDto>> getAssignedPromotions(
            Authentication authentication,
            @PathVariable Long clientId) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            AdminDetails adminDetails = (AdminDetails) authentication.getPrincipal();

            // Vérifier les permissions pour les conseillers
            if (adminDetails.getFonction() != Fonction.ADMIN) {
                Client client = clientService.getClientById(clientId);
                if (client == null) {
                    return ResponseEntity.notFound().build();
                }

                if (!client.getIdConseiller().equals(adminDetails.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            }

            List<AssignedPromotionDto> assignedPromotions = clientService.getAssignedPromotions(clientId);
            return ResponseEntity.ok(assignedPromotions);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Erreur lors de la récupération des promotions assignées: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/{clientId}/promotions/{activationId}/extend")
    public ResponseEntity<String> extendPromotionValidity(
            Authentication authentication,
            @PathVariable Long clientId,
            @PathVariable Long activationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newDateFin) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            AdminDetails adminDetails = (AdminDetails) authentication.getPrincipal();

            // Vérification des permissions pour les conseillers
            if (adminDetails.getFonction() != Fonction.ADMIN) {
                Client client = clientService.getClientById(clientId);
                if (client == null || !client.getIdConseiller().equals(adminDetails.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Vous n'avez pas la permission de modifier cette promotion");
                }
            }

            clientService.extendPromotionValidity(clientId, activationId, newDateFin);

            return ResponseEntity.ok("Période de validité étendue avec succès");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'extension de la période de validité");
        }
    }
    @DeleteMapping("/{clientId}/promotions/assignments")
    public ResponseEntity<String> cancelAssignedPromotions(
            Authentication authentication,
            @PathVariable Long clientId,
            @RequestBody List<Long> activationIds) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            AdminDetails adminDetails = (AdminDetails) authentication.getPrincipal();

            // Vérification des permissions pour les conseillers
            if (adminDetails.getFonction() != Fonction.ADMIN) {
                Client client = clientService.getClientById(clientId);
                if (client == null || !client.getIdConseiller().equals(adminDetails.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Vous n'avez pas la permission d'annuler des promotions pour ce client");
                }
            }

            clientService.cancelAssignedPromotions(clientId, activationIds);

            return ResponseEntity.ok("Promotions annulées avec succès");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'annulation des promotions");
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Promotion>> getAvailablePromotions(
            @RequestParam Long clientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        if (clientId == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            LocalDate startDate = (dateDebut != null) ? dateDebut : LocalDate.now();
            LocalDate endDate = (dateFin != null) ? dateFin : LocalDate.now().plusYears(1);

            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest().build();
            }

            // Add logging before the service call
            System.out.println("Calling service with clientId: " + clientId +
                    ", startDate: " + startDate + ", endDate: " + endDate);

            List<Promotion> promotions = clientService.getAvailablePromotionsForDateRange(
                    clientId, startDate, endDate);

            return ResponseEntity.ok(promotions);

        } catch (Exception e) {
            // LOG THE ACTUAL EXCEPTION - this is crucial!
            e.printStackTrace();
            System.err.println("Error in getAvailablePromotions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/{clientId}/promotions")
    public ResponseEntity<String> assignPromotion(
            Authentication authentication,
            @PathVariable Long clientId,
            @Valid @RequestBody PromotionAssignmentDto assignment) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            AdminDetails adminDetails = (AdminDetails) authentication.getPrincipal();

            // Check permissions for advisors
            if (adminDetails.getFonction() != Fonction.ADMIN) {
                Client client = clientService.getClientById(clientId);
                if (client == null || !client.getIdConseiller().equals(adminDetails.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Vous n'avez pas la permission d'assigner une promotion à ce client");
                }
            }

            clientService.assignPromotionToClient(
                    clientId,
                    assignment.getPromotion_id(),
                    assignment.getDate_debut(),
                    assignment.getDate_fin()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Promotion affectée avec succès au client");

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'assignation de la promotion");
        }
    }


}