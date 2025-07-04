package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "mapping_promotions")
public class MappingPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Source promotion
    @ManyToOne
    @JoinColumn(name = "promotion_source_id", nullable = false)
    private Promotion promotionSource;

    // Target promotion
    @ManyToOne
    @JoinColumn(name = "promotion_cible_id", nullable = false)
    private Promotion promotionCible;

    @Column(name = "type_relation")
    private String typeRelation;

    private String description;

    @Column(name = "est_actif")
    private Boolean estActif;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    public MappingPromotion() {}

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Promotion getPromotionSource() {
        return promotionSource;
    }

    public void setPromotionSource(Promotion promotionSource) {
        this.promotionSource = promotionSource;
    }

    public Promotion getPromotionCible() {
        return promotionCible;
    }

    public void setPromotionCible(Promotion promotionCible) {
        this.promotionCible = promotionCible;
    }

    public String getTypeRelation() {
        return typeRelation;
    }

    public void setTypeRelation(String typeRelation) {
        this.typeRelation = typeRelation;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getEstActif() {
        return estActif;
    }

    public void setEstActif(Boolean estActif) {
        this.estActif = estActif;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    // equals and hashCode based on id

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MappingPromotion)) return false;
        MappingPromotion that = (MappingPromotion) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
