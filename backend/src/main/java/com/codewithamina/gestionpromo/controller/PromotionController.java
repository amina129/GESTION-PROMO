package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.PromotionDTO;
import com.codewithamina.gestionpromo.mapper.PromotionMapper;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionController {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    public PromotionController(PromotionRepository promotionRepository,
                               PromotionMapper promotionMapper) {
        this.promotionRepository = promotionRepository;
        this.promotionMapper = promotionMapper;
    }

    @GetMapping("/search")
    public ResponseEntity<List<PromotionDTO>> searchPromotions(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String sousType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) String categorieClient) {

        List<Promotion> promotions = promotionRepository.searchPromotions(
                nom, type, sousType, dateDebut, dateFin, categorieClient);

        List<PromotionDTO> dtos = promotions.stream()
                .map(promotionMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionDTO promotionDTO) {
        Promotion promotion = promotionMapper.toEntity(promotionDTO);
        Promotion savedPromotion = promotionRepository.save(promotion);
        PromotionDTO savedDto = promotionMapper.toDto(savedPromotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
    }
}