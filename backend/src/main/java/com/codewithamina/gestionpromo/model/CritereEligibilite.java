package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "criteres_eligibilite")
public class CritereEligibilite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(name = "type_critere")
    private String typeCritere;

    private String operateur;

    @Column(name = "valeur_numerique")
    private Double valeurNumerique;

    @Column(name = "valeur_texte")
    private String valeurTexte;

    @Column(name = "valeurs_multiples")
    private String valeursMultiples; // Could be CSV or JSON depending on your design

    @Column(name = "est_actif")
    private Boolean estActif;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    public CritereEligibilite() {}

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getTypeCritere() {
        return typeCritere;
    }

    public void setTypeCritere(String typeCritere) {
        this.typeCritere = typeCritere;
    }

    public String getOperateur() {
        return operateur;
    }

    public void setOperateur(String operateur) {
        this.operateur = operateur;
    }

    public Double getValeurNumerique() {
        return valeurNumerique;
    }

    public void setValeurNumerique(Double valeurNumerique) {
        this.valeurNumerique = valeurNumerique;
    }

    public String getValeurTexte() {
        return valeurTexte;
    }

    public void setValeurTexte(String valeurTexte) {
        this.valeurTexte = valeurTexte;
    }

    public String getValeursMultiples() {
        return valeursMultiples;
    }

    public void setValeursMultiples(String valeursMultiples) {
        this.valeursMultiples = valeursMultiples;
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

    // equals and hashCode (optional but recommended)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CritereEligibilite)) return false;
        CritereEligibilite that = (CritereEligibilite) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
