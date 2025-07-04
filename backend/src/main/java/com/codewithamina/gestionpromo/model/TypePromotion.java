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


    @Column(name = "est_actif")
    private Boolean estActif;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;


    public TypePromotion() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }


    public Boolean getEstActif() { return estActif; }
    public void setEstActif(Boolean estActif) { this.estActif = estActif; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TypePromotion)) return false;
        TypePromotion that = (TypePromotion) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(nom, that.nom) &&
                Objects.equals(description, that.description) &&
                Objects.equals(estActif, that.estActif) &&
                Objects.equals(dateCreation, that.dateCreation) ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nom, description, estActif, dateCreation);
    }
}
