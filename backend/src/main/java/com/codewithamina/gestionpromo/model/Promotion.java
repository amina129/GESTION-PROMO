package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "promotions")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String description;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @Column(nullable = false)
    private String type; // 'relatif' or 'absolu'

    @Column(name = "sous_type", nullable = false)
    private String sousType; // 'remise', 'unite_gratuite', 'point_bonus'

    @Column(nullable = false)
    private BigDecimal valeur;

    @Column(name = "categorie_client", nullable = false)
    private String categorieClient;

    @Column(name = "type_unite")
    private String typeUnite; // 'DATA', 'SMS', 'APPEL'

    @Column(name = "unite_mesure")
    private String uniteMesure; // 'MO', 'GO', 'minutes', 'heures'

    @Column(name = "statut")
    private String statut;

}