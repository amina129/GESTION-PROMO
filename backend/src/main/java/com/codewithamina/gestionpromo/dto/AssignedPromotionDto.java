package com.codewithamina.gestionpromo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class AssignedPromotionDto {
    private Long activationId;
    private Long promotionId;
    private String promotionNom;
    private String promotionDescription;
    private String promotionType;
    private String promotionSousType;
    private BigDecimal promotionValeur;
    private String typeUnite;
    private String uniteMesure;
    private LocalDate dateActivation;
    private LocalDate dateExpiration;
    private String statut; // ACTIVE, EXPIRED, UPCOMING
    private Integer joursRestants; // Nombre de jours avant expiration (null si expiré)

    public AssignedPromotionDto() {}

    public AssignedPromotionDto(Long activationId, Long promotionId, String promotionNom,
                                String promotionDescription, String promotionType, String promotionSousType,
                                BigDecimal promotionValeur, String typeUnite, String uniteMesure,
                                LocalDate dateActivation, LocalDate dateExpiration,
                                String statut, Integer joursRestants) {
        this.activationId = activationId;
        this.promotionId = promotionId;
        this.promotionNom = promotionNom;
        this.promotionDescription = promotionDescription;
        this.promotionType = promotionType;
        this.promotionSousType = promotionSousType;
        this.promotionValeur = promotionValeur;
        this.typeUnite = typeUnite;
        this.uniteMesure = uniteMesure;
        this.dateActivation = dateActivation;
        this.dateExpiration = dateExpiration;
        this.statut = statut;
        this.joursRestants = joursRestants;
    }
}