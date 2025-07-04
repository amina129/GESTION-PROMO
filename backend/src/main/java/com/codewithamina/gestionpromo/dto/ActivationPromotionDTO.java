package com.codewithamina.gestionpromo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ActivationPromotionDTO {
    private Long id;
    private Long clientId;
    private Long promotionId;

    public String getPromotionNom() {
        return promotionNom;
    }

    public void setPromotionNom(String promotionNom) {
        this.promotionNom = promotionNom;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(Long promotionId) {
        this.promotionId = promotionId;
    }

    public LocalDateTime getDateActivation() {
        return dateActivation;
    }

    public void setDateActivation(LocalDateTime dateActivation) {
        this.dateActivation = dateActivation;
    }

    public LocalDateTime getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(LocalDateTime dateExpiration) {
        this.dateExpiration = dateExpiration;
    }

    public BigDecimal getMontantRecharge() {
        return montantRecharge;
    }

    public void setMontantRecharge(BigDecimal montantRecharge) {
        this.montantRecharge = montantRecharge;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    private String promotionNom;
    private LocalDateTime dateActivation;
    private LocalDateTime dateExpiration;
    private BigDecimal montantRecharge;
    private String statut;

    // Constructors, getters, setters
}