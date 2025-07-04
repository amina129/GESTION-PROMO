package com.codewithamina.gestionpromo.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "promotions")
public class Promotion {

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getValeur() {
        return valeur;
    }

    public void setValeur(BigDecimal valeur) {
        this.valeur = valeur;
    }

    public Integer getDureeValidite() {
        return dureeValidite;
    }

    public void setDureeValidite(Integer dureeValidite) {
        this.dureeValidite = dureeValidite;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private String type; // MANUAL, AUTOMATIC
    private BigDecimal valeur;
    private Integer dureeValidite; // in days
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Boolean active;

    private Set<String> typeAbonnementsEligibles;
    private BigDecimal soldeMinimum;
    private Set<String> segmentsClientsEligibles;
    private Boolean estAutomatique;
    private String statut;






    public Set<String> getTypeAbonnementsEligibles() {
        return typeAbonnementsEligibles;
    }

    public void setTypeAbonnementsEligibles(Set<String> typeAbonnementsEligibles) {
        this.typeAbonnementsEligibles = typeAbonnementsEligibles;
    }

    public BigDecimal getSoldeMinimum() {
        return soldeMinimum;
    }

    public void setSoldeMinimum(BigDecimal soldeMinimum) {
        this.soldeMinimum = soldeMinimum;
    }

    public Set<String> getSegmentsClientsEligibles() {
        return segmentsClientsEligibles;
    }

    public void setSegmentsClientsEligibles(Set<String> segmentsClientsEligibles) {
        this.segmentsClientsEligibles = segmentsClientsEligibles;
    }

    public Boolean isEstAutomatique() {
        return estAutomatique != null && estAutomatique;
    }

    public void setEstAutomatique(Boolean estAutomatique) {
        this.estAutomatique = estAutomatique;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public boolean isActive() {
        return active != null && active;
    }

}
