package com.codewithamina.gestionpromo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class PromotionDTO {

    private Long id;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String type;
    private String nom;
    private Double valeur;
    private String categorieClient;

    public PromotionDTO() {
    }

}
