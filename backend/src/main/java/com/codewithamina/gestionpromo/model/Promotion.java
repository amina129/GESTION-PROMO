package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "promotions")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String description;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @Column(nullable = false)
    private String type; // 'relatif' or 'absolu'

    @Column(name = "sous_type", nullable = false)
    private String sousType; // 'remise', 'unite_gratuite', 'point_bonus'

    @Column(nullable = false)
    private BigDecimal valeur;

    @ManyToMany
    @JoinTable(
            name = "promotion_category_mapping",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();


    @Column(name = "type_unite")
    private String typeUnite; // 'DATA', 'SMS', 'APPEL'

    @Column(name = "unite_mesure")
    private String uniteMesure; // 'MO', 'GO', 'minutes', 'heures'

    @Column(name = "statut")
    private String statut;


    public void clearCategories() {
        // Properly handle bidirectional relationship
        for (Category category : this.categories) {
            category.getPromotions().remove(this);
        }
        this.categories.clear();
    }

    public void addCategory(Category category) {
        this.categories.add(category);
        category.getPromotions().add(this);
    }
    // Helper method to maintain backward compatibility
    public List<String> getCategorieClient() {
        return this.categories.stream()
                .map(Category::getCode)
                .distinct()
                .toList();
    }


}