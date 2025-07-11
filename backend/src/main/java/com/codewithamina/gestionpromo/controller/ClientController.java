package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.PromotionAssignmentDto;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.service.ClientService;
import com.codewithamina.gestionpromo.service.ClientServiceImpl;
import com.codewithamina.gestionpromo.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")

public class ClientController {
    private final ClientService clientService;
    private final PromotionService promotionService;
    private final ClientServiceImpl clientServiceImpl;

    public ClientController(ClientService clientService, PromotionService promotionService, ClientServiceImpl clientServiceImpl) {
        this.clientService = clientService;
        this.promotionService = promotionService;
        this.clientServiceImpl = clientServiceImpl;
    }
    @GetMapping("/available")
    public ResponseEntity<List<Promotion>> getAvailablePromotions(
            @RequestParam Long clientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        System.out.println("=== DEBUG getAvailablePromotions ===");
        System.out.println("clientId: " + clientId);
        System.out.println("dateDebut: " + dateDebut);
        System.out.println("dateFin: " + dateFin);

        if (clientId == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            List<Promotion> promotions;

            // Si les dates sont fournies, utiliser la logique avec dates
            if (dateDebut != null && dateFin != null) {
                System.out.println("Recherche avec dates");

                if (dateDebut.isAfter(dateFin)) {
                    System.out.println("Date début après date fin - erreur");
                    return ResponseEntity.badRequest().build();
                }

                // Utiliser la méthode du service avec dates
                promotions = clientServiceImpl.getAvailablePromotionsForDateRange(clientId, dateDebut, dateFin);

            } else {
                System.out.println("Recherche sans dates");

                // Récupérer la catégorie client depuis le service
                String categorieClient = clientServiceImpl.getCategorieClientById(clientId);
                System.out.println("categorieClient: " + categorieClient);

                if (categorieClient == null) {
                    return ResponseEntity.notFound().build();
                }

                // Vous devez ajouter cette méthode dans votre service ou utiliser PromotionService
                // Pour l'instant, utilisons la méthode existante avec dates
                promotions = clientServiceImpl.getAvailablePromotionsForDateRange(
                        clientId, LocalDate.now(), LocalDate.now().plusYears(1));
            }

            System.out.println("Nombre de promotions trouvées: " + promotions.size());
            return ResponseEntity.ok(promotions);

        } catch (Exception e) {
            System.err.println("Erreur: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Client>> searchClients(
            @RequestParam(required = false) String numero_telephone,
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String categorie_client) {

        List<Client> clients = clientService.searchClients(
                numero_telephone,
                prenom,
                nom,
                email,
                categorie_client
        );

        return ResponseEntity.ok(clients);
    }

    @PostMapping("/{clientId}/promotions")
    public ResponseEntity<String> assignPromotion(
            @PathVariable Long clientId,
            @Valid @RequestBody PromotionAssignmentDto assignment) {

        clientService.assignPromotionToClient(
                clientId,
                assignment.getPromotion_id(),
                assignment.getDate_debut(),
                assignment.getDate_fin()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Promotion affectée avec succès au client");
    }
}