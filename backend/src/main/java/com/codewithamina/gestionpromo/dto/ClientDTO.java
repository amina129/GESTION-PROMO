package com.codewithamina.gestionpromo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
public class ClientDTO {
    private Long id;
    private String numeroTelephone;
    private String codeClient;
    private String nom;
    private String prenom;
    private String email;
    private String typeAbonnement;
    private String statut;
    private BigDecimal solde;
    private LocalDateTime derniereRecharge;


}