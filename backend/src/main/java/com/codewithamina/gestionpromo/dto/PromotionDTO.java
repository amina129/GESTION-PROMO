package com.codewithamina.gestionpromo.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class PromotionDTO {
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255, message = "Le nom ne doit pas dépasser 255 caractères")
    private String nom;

    @Size(max = 1000, message = "La description ne doit pas dépasser 1000 caractères")
    private String description;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    @NotBlank(message = "Le type est obligatoire")
    @Pattern(regexp = "relatif|absolu", message = "Le type doit être 'relatif' ou 'absolu'")
    private String type;

    @NotBlank(message = "Le sous-type est obligatoire")
    private String sousType;

    @NotNull(message = "La valeur est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "La valeur doit être positive")
    private BigDecimal valeur;

    @NotEmpty(message = "La liste des catégories clients ne doit pas être vide")
    private List<String> categorieClient;  // Removed @Pattern validation

    @Pattern(regexp = "DATA|SMS|APPEL", message = "Le type d'unité doit être 'DATA', 'SMS' ou 'APPEL'")
    private String typeUnite;

    private String uniteMesure;

    @Pattern(regexp = "ACTIF|INACTIF|EXPIRÉ", message = "Le statut doit être 'ACTIF', 'INACTIF' ou 'EXPIRÉ'")
    private String statut;
}