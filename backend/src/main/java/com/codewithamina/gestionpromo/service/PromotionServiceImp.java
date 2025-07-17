package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImp implements PromotionService {
    private static final Set<String> VALID_CATEGORIES = Set.of(
            "GP",
            "privé",
            "VIP",
            "B2B"
    );
    private final PromotionRepository promotionRepository;

    public PromotionServiceImp(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @Override
    public List<Promotion> findByCategorieClient(String categorieClient) {
        LocalDate today = LocalDate.now();
        return promotionRepository.findAvailableByCategorieClient(categorieClient, today);
    }

    @Override
    public Promotion prolongerPromotion(Long promotionId, String nouvelleDateFin) {
        // Find the promotion
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion avec l'ID " + promotionId + " introuvable"));

        try {
            LocalDate newEndDate = LocalDate.parse(nouvelleDateFin);
            LocalDate currentEndDate = promotion.getDateFin(); // Already a LocalDate

            if (newEndDate.isBefore(currentEndDate) || newEndDate.isEqual(currentEndDate)) {
                throw new IllegalArgumentException("La nouvelle date de fin doit être après la date de fin actuelle: " + currentEndDate);
            }

            // Validate new date is not in the past
            if (newEndDate.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("La nouvelle date de fin ne peut pas être dans le passé");
            }

            // Update the promotion
            promotion.setDateFin(newEndDate);

            return promotionRepository.save(promotion);

        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Format de date invalide. Utilisez le format: yyyy-MM-dd");
        }
    }

    @Override
    public Promotion etendreCategories(Long promotionId, List<String> nouvellesCategories) {
        // Find the promotion
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion avec l'ID " + promotionId + " introuvable"));

        // Validate categories
        if (nouvellesCategories == null || nouvellesCategories.isEmpty()) {
            throw new IllegalArgumentException("La liste des catégories ne peut pas être vide");
        }

        // Check if all categories are valid
        for (String category : nouvellesCategories) {
            if (!VALID_CATEGORIES.contains(category.toUpperCase())) {
                throw new IllegalArgumentException("Catégorie invalide: " + category +
                        ". Catégories valides: " + String.join(", ", VALID_CATEGORIES));
            }
        }

        Set<String> allCategories = new HashSet<>();

        // Add current category
        if (promotion.getCategorieClient() != null && !promotion.getCategorieClient().isEmpty()) {
            // Handle both single category and comma-separated categories
            String[] currentCategories = promotion.getCategorieClient().split(",");
            for (String cat : currentCategories) {
                allCategories.add(cat.trim().toUpperCase());
            }
        }

        // Add new categories
        for (String category : nouvellesCategories) {
            allCategories.add(category.toUpperCase());
        }

        // Update the promotion with all categories
        String updatedCategories = allCategories.stream()
                .sorted()
                .collect(Collectors.joining(","));

        promotion.setCategorieClient(updatedCategories);

        return promotionRepository.save(promotion);

}}