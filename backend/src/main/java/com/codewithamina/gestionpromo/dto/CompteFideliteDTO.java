package com.codewithamina.gestionpromo.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CompteFideliteDTO {
    private Long id;
    private Long clientId;
    private BigDecimal points;
    private String niveau;
    private LocalDateTime dateCreation;
    private LocalDateTime derniereActivite;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public BigDecimal getPoints() {
        return points;
    }

    public void setPoints(BigDecimal points) {
        this.points = points;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDerniereActivite() {
        return derniereActivite;
    }

    public void setDerniereActivite(LocalDateTime derniereActivite) {
        this.derniereActivite = derniereActivite;
    }
}