package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.PromotionAssignmentDto;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.service.ClientService;
import com.codewithamina.gestionpromo.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientService clientService;
    private final PromotionService promotionService;

    public ClientController(ClientService clientService, PromotionService promotionService) {
        this.clientService = clientService;
        this.promotionService = promotionService;
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