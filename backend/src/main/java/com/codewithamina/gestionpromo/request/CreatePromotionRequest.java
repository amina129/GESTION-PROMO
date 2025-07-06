package com.codewithamina.gestionpromo.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CreatePromotionRequest {

    @NotBlank
    private String codePromotion;
    private String nom;
    @NotBlank
    private String description;
    private BigDecimal soldeMinimum;
    private BigDecimal soldeMaximum;
    private List<String> segmentsClientsEligibles;
    private Double montantBonus;
    private Double pourcentageBonus;
    private Integer minutesBonus;
    private Integer smsBonus;
    private Integer dataBonusMb;
    private Integer pointsFidelite;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Integer utilisationsMaxParClient;
    private Integer utilisationsMaxGlobales;
    private Integer priorite;
    private Boolean estAutomatique;
    private Boolean necessiteCode;
    private Integer creePar;
    private Integer approuvePar;
    private LocalDateTime dateModification;
    private Boolean active;
    private Integer dureeValidite;
    private String type;
    private Integer idCategoriePromotion;

}
