package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "types_promotion", schema = "public")
public class TypePromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String description;

    // Relation to CategoriePromotion
    @ManyToOne
    @JoinColumn(name = "categorie")  // FK column in types_promotion pointing to categorie_promotion.id
    private CategoriePromotion categoriePromotion;

    @Column(name = "est_actif")
    private Boolean estActif;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @ManyToOne
    @JoinColumn(name = "id") // adjust column name if different
    private Promotion promotion;

    @ManyToOne
    @JoinColumn(name = "id") // adjust column name if different
    private ActivationPromotion activation;

    // Constructors, getters, setters, equals, hashCode ...

    public TypePromotion() {
    }

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public CategoriePromotion getCategoriePromotion() { return categoriePromotion; }
    public void setCategoriePromotion(CategoriePromotion categoriePromotion) { this.categoriePromotion = categoriePromotion; }

    public Boolean getEstActif() { return estActif; }
    public void setEstActif(Boolean estActif) { this.estActif = estActif; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public Promotion getPromotion() { return promotion; }
    public void setPromotion(Promotion promotion) { this.promotion = promotion; }

    public ActivationPromotion getActivation() { return activation; }
    public void setActivation(ActivationPromotion activation) { this.activation = activation; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TypePromotion)) return false;
        TypePromotion that = (TypePromotion) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(nom, that.nom) &&
                Objects.equals(description, that.description) &&
                Objects.equals(categoriePromotion, that.categoriePromotion) &&
                Objects.equals(estActif, that.estActif) &&
                Objects.equals(dateCreation, that.dateCreation) &&
                Objects.equals(promotion, that.promotion) &&
                Objects.equals(activation, that.activation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nom, description, categoriePromotion, estActif, dateCreation, promotion, activation);
    }
}
