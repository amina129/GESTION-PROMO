package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "categories_client")
public class CategorieClient {
    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "libelle")
    private String libelle;

    // Constructors
    public CategorieClient() {}

    public CategorieClient(String code, String libelle) {
        this.code = code;
        this.libelle = libelle;
    }

    public void setId(Long id) { this.id = id; }

    public void setCode(String code) { this.code = code; }

    public void setLibelle(String libelle) { this.libelle = libelle; }
}




