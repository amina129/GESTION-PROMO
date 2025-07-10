package com.codewithamina.gestionpromo.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreatePromotionRequest {

    private String nom;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String type;
    private Double valeur;
    private String categorieClient;

    public CreatePromotionRequest() {
    }
}
