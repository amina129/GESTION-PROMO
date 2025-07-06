package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDTO {

    private Long id;
    private String nom;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String typePromotion;
    private Double montant;
    private Integer pointsFidelite;
    private String codePromotion;
    private BigDecimal soldeMinimum;
    private BigDecimal soldeMaximum;
    private List<String> segmentsClientsEligibles;
    private BigDecimal montantBonus;
    private BigDecimal pourcentageBonus;
    private Integer minutesBonus;
    private Integer smsBonus;
    private Integer dataBonusMb;
    private Integer utilisationsMaxParClient;
    private Integer utilisationsMaxGlobales;
    private Integer priorite;
    private Boolean estAutomatique;
    private Boolean necessiteCode;
    private Long creePar;
    private Long approuvePar;
    private LocalDate dateModification;
    private Boolean active;
    private Integer dureeValidite;
    private Long idCategoriePromotion;

    @Override
    public String toString() {
        return "PromotionDTO{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", description='" + description + '\'' +
                ", dateDebut=" + dateDebut +
                ", dateFin=" + dateFin +
                ", typePromotion='" + typePromotion + '\'' +
                ", montant=" + montant +
                ", pointsFidelite=" + pointsFidelite +
                '}';
    }
}
