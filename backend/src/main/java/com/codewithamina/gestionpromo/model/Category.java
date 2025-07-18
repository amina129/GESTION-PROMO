package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "categories_client")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private String libelle;

    @ManyToMany(mappedBy = "categories")
    private Set<Promotion> promotions = new HashSet<>();

    // Helper method to add promotion
    public void addPromotion(Promotion promotion) {
        this.promotions.add(promotion);
        promotion.getCategories().add(this);
    }

    // Helper method to remove promotion
    public void removePromotion(Promotion promotion) {
        this.promotions.remove(promotion);
        promotion.getCategories().remove(this);
    }
}