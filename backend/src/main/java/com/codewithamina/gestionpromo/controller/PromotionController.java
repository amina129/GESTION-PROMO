package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:3000") // Autoriser les requêtes depuis React
public class PromotionController {

    private final PromotionRepository promotionRepository;

    public PromotionController(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<Promotion>> searchPromotions(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String sousType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) String categorieClient) {

        List<Promotion> promotions = promotionRepository.searchPromotions(
                nom, type, sousType, dateDebut, dateFin, categorieClient);

        return ResponseEntity.ok(promotions);
    }

    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion savedPromotion = promotionRepository.save(promotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPromotion);
    }
}
