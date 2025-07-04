package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "parametres_systeme")
public class ParametreSysteme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cle;

    private String valeur;

    @Column(name = "type_donnee")
    private String typeDonnee;

    @Column(name = "modifiable_par")
    private String modifiablePar;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    public ParametreSysteme() {}

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCle() {
        return cle;
    }

    public void setCle(String cle) {
        this.cle = cle;
    }

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }

    public String getTypeDonnee() {
        return typeDonnee;
    }

    public void setTypeDonnee(String typeDonnee) {
        this.typeDonnee = typeDonnee;
    }

    public String getModifiablePar() {
        return modifiablePar;
    }

    public void setModifiablePar(String modifiablePar) {
        this.modifiablePar = modifiablePar;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateModification() {
        return dateModification;
    }

    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    // equals and hashCode

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ParametreSysteme)) return false;
        ParametreSysteme that = (ParametreSysteme) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(cle, that.cle) &&
                Objects.equals(valeur, that.valeur) &&
                Objects.equals(typeDonnee, that.typeDonnee) &&
                Objects.equals(modifiablePar, that.modifiablePar) &&
                Objects.equals(dateCreation, that.dateCreation) &&
                Objects.equals(dateModification, that.dateModification);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, cle, valeur, typeDonnee, modifiablePar, dateCreation, dateModification);
    }
}
