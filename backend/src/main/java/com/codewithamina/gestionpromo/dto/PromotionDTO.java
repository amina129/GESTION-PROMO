package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

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
