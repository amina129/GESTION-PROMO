package com.codewithamina.gestionpromo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CreatePromotionRequest {

    @NotBlank
    private String code;

    private String nom;

    @NotBlank
    private String description;

    private BigDecimal valeur;

    private Integer dureeValidite;

    @NotNull
    private LocalDateTime dateDebut;

    @NotNull
    private LocalDateTime dateFin;

    private Boolean active;

    // === Getters ===
    public String getCode() {
        return code;
    }

    public String getNom() {
        return nom;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getValeur() {
        return valeur;
    }

    public Integer getDureeValidite() {
        return dureeValidite;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public Boolean getActive() {
        return active;
    }

    // === Setters ===
    public void setCode(String code) {
        this.code = code;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setValeur(BigDecimal valeur) {
        this.valeur = valeur;
    }

    public void setDureeValidite(Integer dureeValidite) {
        this.dureeValidite = dureeValidite;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
