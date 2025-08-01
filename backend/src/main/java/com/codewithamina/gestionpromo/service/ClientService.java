package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.AssignedPromotionDto;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;

import java.time.LocalDate;
import java.util.List;

public interface ClientService {
    // Core CRUD operations
    Client getClientById(Long clientId);

    // Promotion assignment
    void assignPromotionToClient(Long clientId, Long promotionId, LocalDate dateDebut, LocalDate dateFin);
    List<Promotion> getAvailablePromotionsForDateRange(Long clientId, LocalDate dateDebut, LocalDate dateFin);

    // Get assigned promotions
    List<AssignedPromotionDto> getAssignedPromotions(Long clientId);

    // Single search method that handles both admin and advisor cases
    List<Client> searchClients(
            Long currentUserId,
            String userRole,
            String numeroTelephone,
            String prenom,
            String nom,
            String email,
            Long categorieClient
    );

    void cancelAssignedPromotions(Long clientId, List<Long> activationIds);
    void extendPromotionValidity(Long clientId, Long activationId, LocalDate newDateFin);


}