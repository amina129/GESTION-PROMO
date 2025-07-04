package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "client")
public class Client {

    // Getters and Setters
    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_client", unique = true, nullable = false)
    private String codeClient;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "numero_telephone", unique = true, nullable = false)
    private String numeroTelephone;

    @Column(name = "email")
    private String email;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(name = "type_abonnement")
    private String typeAbonnement;

    @Column(name = "statut")
    private String statut;

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription;

    @Column(name = "derniere_recharge")
    private LocalDateTime derniereRecharge;

    @Column(name = "solde", precision = 10, scale = 2)
    private BigDecimal solde;

    @Column(name = "id_categorie_client")
    private Long idCategorieClient;

    // Constructors
    public Client() {
    }

    public Client(String codeClient, String nom, String prenom, String numeroTelephone) {
        this.codeClient = codeClient;
        this.nom = nom;
        this.prenom = prenom;
        this.numeroTelephone = numeroTelephone;
        this.dateInscription = LocalDateTime.now();
        this.solde = BigDecimal.ZERO;
        this.statut = "ACTIF";
    }
    @ManyToOne
    @JoinColumn(name = "id_categorie_client")
    private CategorieClient categorieClient;

}