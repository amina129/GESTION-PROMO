package com.codewithamina.gestionpromo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    private String type;

    @Column(name = "sous_type", nullable = false)
    private String sousType;

    @Column(nullable = false)
    private BigDecimal valeur;

    @Column(name = "type_unite")
    private String typeUnite;

    @Column(name = "unite_mesure")
    private String uniteMesure;

    @Column(name = "statut")
    private String statut;

    @ManyToMany
    @JoinTable(
            name = "promotion_category_mapping",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @JsonManagedReference // Évite la récursion lors de la sérialisation JSON
    private Set<Category> categories = new HashSet<>();

    // Ajoute une catégorie à la promotion
    public void addCategory(Category category) {
        this.categories.add(category);
        category.getPromotions().add(this);
    }

    // Vide les catégories associées
    public void clearCategories() {
        for (Category category : this.categories) {
            category.getPromotions().remove(this);
        }
        this.categories.clear();
    }

    // Retourne la liste des codes de catégorie client
    public List<String> getCategorieClient() {
        return this.categories.stream()
                .map(Category::getCode)
                .distinct()
                .toList();
    }
}
