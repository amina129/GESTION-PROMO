package com.codewithamina.gestionpromo.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

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
    @Pattern(regexp = "remise|unite_gratuite|point_bonus",
            message = "Le sous-type doit être 'remise', 'unite_gratuite' ou 'point_bonus'")
    private String sousType;

    @NotNull(message = "La valeur est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "La valeur doit être positive")
    private BigDecimal valeur;

    @NotBlank(message = "La catégorie client est obligatoire")
    @Pattern(regexp = "VIP|B2B|JP|privé",
            message = "La catégorie client doit être 'VIP', 'B2B', 'JP' ou 'privé'")
    private String categorieClient;

    @Pattern(regexp = "DATA|SMS|APPEL", message = "Le type d'unité doit être 'DATA', 'SMS' ou 'APPEL'")
    private String typeUnite; // Peut être null

    @Pattern(regexp = "MO|GO|minutes|heures", message = "L'unité de mesure doit être 'MO', 'GO', 'minutes' ou 'heures'")
    private String uniteMesure; // Peut être null
}