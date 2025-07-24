package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.PromotionDTO;
import com.codewithamina.gestionpromo.dto.SousTypePromotionDTO;
import com.codewithamina.gestionpromo.mapper.PromotionMapper;
import com.codewithamina.gestionpromo.model.Category;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.model.SousTypePromotion;
import com.codewithamina.gestionpromo.repository.CategoryRepository;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import com.codewithamina.gestionpromo.repository.SousTypePromotionRepository;
import com.codewithamina.gestionpromo.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;
    private final CategoryRepository categoryRepository;
    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;
    private final SousTypePromotionRepository sousTypePromotionRepository;

    public PromotionController(PromotionService promotionService,
                               CategoryRepository categoryRepository,
                               PromotionRepository promotionRepository,
                               PromotionMapper promotionMapper,
                               SousTypePromotionRepository sousTypePromotionRepository) { // Add this parameter
        this.promotionService = promotionService;
        this.categoryRepository = categoryRepository;
        this.promotionRepository = promotionRepository;
        this.promotionMapper = promotionMapper;
        this.sousTypePromotionRepository = sousTypePromotionRepository; // Initialize it
    }

    @GetMapping("/sous-types-promotion")
    public ResponseEntity<List<SousTypePromotionDTO>> getSousTypesByType(
            @RequestParam String typeCode) {

        List<SousTypePromotion> sousTypes = sousTypePromotionRepository.findByTypePromotionCode(typeCode);

        List<SousTypePromotionDTO> dtos = sousTypes.stream()
                .map(sousType -> new SousTypePromotionDTO(
                        sousType.getId(),
                        sousType.getCode(),
                        sousType.getLibelle()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
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
    public ResponseEntity<PromotionDTO> createPromotion(@Valid @RequestBody PromotionDTO promotionDTO) {
        Promotion promotion = promotionMapper.toEntity(promotionDTO);
        Promotion savedPromotion = promotionRepository.save(promotion);
        PromotionDTO savedDto = promotionMapper.toDto(savedPromotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDto);
    }

    @PutMapping("/{id}/prolonger")
    public ResponseEntity<PromotionDTO> prolongerPromotion(
            @PathVariable Long id,
            @RequestBody ProlongationRequest request) {
        try {
            Promotion updatedPromotion = promotionService.prolongerPromotion(id, request.getNouvelleDateFin());
            PromotionDTO updatedDto = promotionMapper.toDto(updatedPromotion);
            return ResponseEntity.ok(updatedDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/etendre-categories")
    public ResponseEntity<?> etendreCategories(
            @PathVariable Long id,
            @RequestBody ExtensionCategoriesRequest request) {

        try {
            // 1. Charger la promotion avec ses catégories existantes
            Promotion promotion = promotionService.getPromotionWithCategories(id);

            // 2. Charger les nouvelles catégories
            List<Category> newCategories = categoryRepository.findByCodeIn(request.getCategories());

            // 3. Valider que toutes les catégories existent
            if (newCategories.size() != request.getCategories().size()) {
                Set<String> foundCodes = newCategories.stream()
                        .map(Category::getCode)
                        .collect(Collectors.toSet());

                List<String> missingCodes = request.getCategories().stream()
                        .filter(code -> !foundCodes.contains(code))
                        .collect(Collectors.toList());

                return ResponseEntity.badRequest().body(new ErrorResponse("Catégories introuvables: " + missingCodes));
            }

            // 4. Ajouter seulement les nouvelles catégories
            newCategories.forEach(category -> {
                if (!promotion.getCategories().contains(category)) {
                    promotion.addCategory(category);
                }
            });

            // 5. Sauvegarder
            Promotion updated = promotionRepository.save(promotion);
            return ResponseEntity.ok(promotionMapper.toDto(updated));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Simple DTO for error responses
    public record ErrorResponse(String message) {}

    // Request DTOs
    public static class ProlongationRequest {
        private String nouvelleDateFin;

        public String getNouvelleDateFin() {
            return nouvelleDateFin;
        }

        public void setNouvelleDateFin(String nouvelleDateFin) {
            this.nouvelleDateFin = nouvelleDateFin;
        }
    }

    public static class ExtensionCategoriesRequest {
        private List<String> categories;

        public List<String> getCategories() {
            return categories;
        }

        public void setCategories(List<String> categories) {
            this.categories = categories;
        }
    }
}