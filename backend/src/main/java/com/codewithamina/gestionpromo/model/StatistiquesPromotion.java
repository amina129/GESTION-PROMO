package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "statistiques_promotions")
public class StatistiquesPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to Promotion entity
    @ManyToOne
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;

    @Column(name = "date_statistique")
    private LocalDate dateStatistique;

    @Column(name = "nombre_activations")
    private Integer nombreActivations;

    @Column(name = "nombre_utilisations")
    private Integer nombreUtilisations;

    @Column(name = "montant_total_bonus")
    private BigDecimal montantTotalBonus;

    @Column(name = "taux_conversion")
    private Double tauxConversion;

    @Column(name = "taux_utilisation")
    private Double tauxUtilisation;

    // Assuming JSON stored as String, adjust if you use JSON mapping libs
    @Column(name = "repartition_par_segment", columnDefinition = "TEXT")
    private String repartitionParSegment;

    @Column(name = "repartition_par_type_abonnement", columnDefinition = "TEXT")
    private String repartitionParTypeAbonnement;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    public StatistiquesPromotion() {}

// Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Promotion getPromotion() {
        return promotion;
    }

    public void setPromotion(Promotion promotion) {
        this.promotion = promotion;
    }

    public LocalDate getDateStatistique() {
        return dateStatistique;
    }

    public void setDateStatistique(LocalDate dateStatistique) {
        this.dateStatistique = dateStatistique;
    }

    public Integer getNombreActivations() {
        return nombreActivations;
    }

    public void setNombreActivations(Integer nombreActivations) {
        this.nombreActivations = nombreActivations;
    }

    public Integer getNombreUtilisations() {
        return nombreUtilisations;
    }

    public void setNombreUtilisations(Integer nombreUtilisations) {
        this.nombreUtilisations = nombreUtilisations;
    }

    public BigDecimal getMontantTotalBonus() {
        return montantTotalBonus;
    }

    public void setMontantTotalBonus(BigDecimal montantTotalBonus) {
        this.montantTotalBonus = montantTotalBonus;
    }

    public Double getTauxConversion() {
        return tauxConversion;
    }

    public void setTauxConversion(Double tauxConversion) {
        this.tauxConversion = tauxConversion;
    }

    public Double getTauxUtilisation() {
        return tauxUtilisation;
    }

    public void setTauxUtilisation(Double tauxUtilisation) {
        this.tauxUtilisation = tauxUtilisation;
    }

    public String getRepartitionParSegment() {
        return repartitionParSegment;
    }

    public void setRepartitionParSegment(String repartitionParSegment) {
        this.repartitionParSegment = repartitionParSegment;
    }

    public String getRepartitionParTypeAbonnement() {
        return repartitionParTypeAbonnement;
    }

    public void setRepartitionParTypeAbonnement(String repartitionParTypeAbonnement) {
        this.repartitionParTypeAbonnement = repartitionParTypeAbonnement;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

// equals and hashCode (already provided in previous snippet)

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StatistiquesPromotion that)) return false;
        return Objects.equals(id, that.id) &&
                Objects.equals(promotion, that.promotion) &&
                Objects.equals(dateStatistique, that.dateStatistique);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, promotion, dateStatistique);
    }
}
