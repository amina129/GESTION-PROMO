package com.codewithamina.gestionpromo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
public class ActivationPromotionDTO {
    private Long id;
    private Long clientId;
    private Long promotionId;

    private String promotionNom;
    private LocalDateTime dateActivation;
    private LocalDateTime dateExpiration;
    private BigDecimal montantRecharge;
    private String statut;

    // Constructors, getters, setters
}