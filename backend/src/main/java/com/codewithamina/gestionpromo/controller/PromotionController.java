package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.PromotionDTO;
import com.codewithamina.gestionpromo.mapper.PromotionMapper;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import com.codewithamina.gestionpromo.service.PromotionServiceImp;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;
    private final PromotionServiceImp promotionServiceImp;

    public PromotionController(PromotionRepository promotionRepository,
                               PromotionMapper promotionMapper, PromotionServiceImp promotionServiceImp) {
        this.promotionRepository = promotionRepository;
        this.promotionMapper = promotionMapper;
        this.promotionServiceImp = promotionServiceImp;
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
            Promotion updatedPromotion = promotionServiceImp.prolongerPromotion(id, request.getNouvelleDateFin());
            PromotionDTO updatedDto = promotionMapper.toDto(updatedPromotion);
            return ResponseEntity.ok(updatedDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/etendre-categories")
    public ResponseEntity<PromotionDTO> etendreCategories(
            @PathVariable Long id,
            @RequestBody ExtensionCategoriesRequest request) {
        try {
            Promotion updatedPromotion = promotionServiceImp.etendreCategories(id, request.getCategories());
            PromotionDTO updatedDto = promotionMapper.toDto(updatedPromotion);
            return ResponseEntity.ok(updatedDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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