package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Category;
import com.codewithamina.gestionpromo.model.Promotion;
import com.codewithamina.gestionpromo.repository.CategoryRepository;
import com.codewithamina.gestionpromo.repository.PromotionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImp implements PromotionService {
    private final PromotionRepository promotionRepository;
    private final CategoryRepository categoryRepository;

    public PromotionServiceImp(PromotionRepository promotionRepository, CategoryRepository categoryRepository) {
        this.promotionRepository = promotionRepository;
        this.categoryRepository = categoryRepository;
    }

    private static final Set<String> VALID_CATEGORIES = Set.of("GP", "privé", "VIP", "B2B");

    @Override
    public List<Promotion> findByCategorieClient(String categorieClient) {
        LocalDate today = LocalDate.now();
        return promotionRepository.findAvailableByCategorieClient(categorieClient, today);
    }

    @Override
    public Promotion prolongerPromotion(Long promotionId, String nouvelleDateFin) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion avec l'ID " + promotionId + " introuvable"));

        try {
            LocalDate newEndDate = LocalDate.parse(nouvelleDateFin);
            LocalDate currentEndDate = promotion.getDateFin();

            if (!newEndDate.isAfter(currentEndDate)) {
                throw new IllegalArgumentException("La nouvelle date de fin doit être après la date actuelle: " + currentEndDate);
            }

            if (newEndDate.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("La nouvelle date de fin ne peut pas être dans le passé");
            }

            promotion.setDateFin(newEndDate);
            return promotionRepository.save(promotion);

        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Format de date invalide. Utilisez le format: yyyy-MM-dd");
        }
    }
    @Override
    @Transactional
    public Promotion etendreCategories(Long promotionId, List<String> categoryCodes) {
        // 1. Charger la promotion avec ses catégories
        Promotion promotion = promotionRepository.findWithCategoriesById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion introuvable"));

        // 2. Charger les nouvelles catégories en une seule requête
        List<Category> newCategories = categoryRepository.findByCodeIn(categoryCodes);

        // 3. Valider que toutes les catégories existent
        if (newCategories.size() != categoryCodes.size()) {
            Set<String> foundCodes = newCategories.stream()
                    .map(Category::getCode)
                    .collect(Collectors.toSet());

            List<String> missingCodes = categoryCodes.stream()
                    .filter(code -> !foundCodes.contains(code))
                    .collect(Collectors.toList());

            throw new IllegalArgumentException("Catégories introuvables: " + missingCodes);
        }

        // 4. Ajouter seulement les nouvelles catégories
        newCategories.forEach(category -> {
            if (!promotion.getCategories().contains(category)) {
                promotion.addCategory(category);
            }
        });

        // 5. Explicitly save and flush
        Promotion savedPromotion = promotionRepository.save(promotion);
        promotionRepository.flush(); // Force immediate write to database

        return savedPromotion;
    }
    @Override
    public Promotion getPromotionWithCategories(Long id) {
        return promotionRepository.findWithCategoriesById(id)
                .orElseThrow(() -> new RuntimeException("Promotion introuvable"));
    }
}
