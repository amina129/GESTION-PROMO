package com.codewithamina.gestionpromo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ClientDTO {
    private Long id;
    private String numeroTelephone;
    private String codeClient;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroTelephone() {
        return numeroTelephone;
    }

    public void setNumeroTelephone(String numeroTelephone) {
        this.numeroTelephone = numeroTelephone;
    }

    public String getCodeClient() {
        return codeClient;
    }

    public void setCodeClient(String codeClient) {
        this.codeClient = codeClient;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTypeAbonnement() {
        return typeAbonnement;
    }

    public void setTypeAbonnement(String typeAbonnement) {
        this.typeAbonnement = typeAbonnement;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public BigDecimal getSolde() {
        return solde;
    }

    public void setSolde(BigDecimal solde) {
        this.solde = solde;
    }

    public LocalDateTime getDerniereRecharge() {
        return derniereRecharge;
    }

    public void setDerniereRecharge(LocalDateTime derniereRecharge) {
        this.derniereRecharge = derniereRecharge;
    }

    private String nom;
    private String prenom;
    private String email;
    private String typeAbonnement;
    private String statut;
    private BigDecimal solde;
    private LocalDateTime derniereRecharge;

}