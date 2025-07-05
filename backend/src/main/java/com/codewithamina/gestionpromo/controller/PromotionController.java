package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.ActivationPromotionDTO;
import com.codewithamina.gestionpromo.dto.EligibilityResult;
import com.codewithamina.gestionpromo.dto.PromotionDTO;
import com.codewithamina.gestionpromo.exception.ClientNotFoundException;
import com.codewithamina.gestionpromo.exception.DuplicatePromotionCodeException;
import com.codewithamina.gestionpromo.exception.PromotionNotActiveException;
import com.codewithamina.gestionpromo.exception.PromotionNotFoundException;
import com.codewithamina.gestionpromo.mapper.ActivationPromotionMapper;
import com.codewithamina.gestionpromo.mapper.PromotionMapper;
import com.codewithamina.gestionpromo.model.ActivationPromotion;
import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.request.*;
import com.codewithamina.gestionpromo.service.ClientService;
import com.codewithamina.gestionpromo.service.EligibilityService;
import com.codewithamina.gestionpromo.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private EligibilityService eligibilityService;

    // Get all active promotions
    @GetMapping
    public ResponseEntity<List<PromotionDTO>> getAllPromotions(
            @RequestParam(defaultValue = "true") boolean activeOnly) {
        List<Promotion> promotions = promotionService.getAllPromotions(activeOnly);
        return ResponseEntity.ok(promotions.stream()
                .map(PromotionMapper::toDTO)
                .collect(Collectors.toList()));
    }

    // Get promotion by code
    @GetMapping("/{code}")
    public ResponseEntity<PromotionDTO> getPromotionByCode(@PathVariable String code) {
        try {
            Promotion promotion = promotionService.findByCode(code);
            return ResponseEntity.ok(PromotionMapper.toDTO(promotion));
        } catch (PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Activate promotion for a client (Manual activation by consultant)
    @PostMapping("/{code}/activate")
    public ResponseEntity<ActivationPromotionDTO> activatePromotion(
            @PathVariable String code,
            @RequestBody @Valid ActivationRequest request) {
        try {
            Client client = clientService.findByNumeroTelephone(request.getPhoneNumber());
            Promotion promotion = promotionService.findByCode(code);

            // Check eligibility
            if (!eligibilityService.isEligible(client, promotion)) {
                return ResponseEntity.badRequest()
                        .header("Error-Message", "Client not eligible for this promotion")
                        .build();
            }

            ActivationPromotion activation = promotionService.activatePromotion(
                    client, promotion, request.getMontantRecharge());

            return ResponseEntity.ok(ActivationPromotionMapper.toDTO(activation));

        } catch (ClientNotFoundException | PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (PromotionNotActiveException e) {
            return ResponseEntity.badRequest()
                    .header("Error-Message", "Promotion is not active")
                    .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .header("Error-Message", "Internal server error")
                    .build();
        }
    }

    // Check promotion eligibility for a client
    @PostMapping("/{code}/check-eligibility")
    public ResponseEntity<EligibilityCheckResponse> checkEligibility(
            @PathVariable String code,
            @RequestBody @Valid EligibilityCheckRequest request) {
        try {
            Client client = clientService.findByNumeroTelephone(request.getPhoneNumber());
            Promotion promotion = promotionService.findByCode(code);

            EligibilityResult result = eligibilityService.checkEligibilityDetailed(client, promotion);

            return ResponseEntity.ok(new EligibilityCheckResponse(
                    result.isEligible(),
                    result.getFailedCriteria(),
                    result.getReasons()
            ));

        } catch (ClientNotFoundException | PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


    // Create new promotion
    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody @Valid CreatePromotionRequest request) {
        try {
            Promotion promotion = promotionService.createPromotion(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(PromotionMapper.toDTO(promotion));
        } catch (DuplicatePromotionCodeException e) {
            return ResponseEntity.badRequest()
                    .header("Error-Message", "Promotion code already exists")
                    .build();
        }
    }

    // Update promotion
    @PutMapping("/{code}")
    public ResponseEntity<PromotionDTO> updatePromotion(
            @PathVariable String code,
            @RequestBody @Valid UpdatePromotionRequest request) {
        try {
            Promotion promotion = promotionService.updatePromotion(code, request);
            return ResponseEntity.ok(PromotionMapper.toDTO(promotion));
        } catch (PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Deactivate promotion (Admin only)
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deactivatePromotion(@PathVariable String code) {
        try {
            promotionService.deactivatePromotion(code);
            return ResponseEntity.noContent().build();
        } catch (PromotionNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


}

