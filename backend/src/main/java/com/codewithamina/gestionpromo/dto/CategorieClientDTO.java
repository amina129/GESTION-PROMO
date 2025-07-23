package com.codewithamina.gestionpromo.dto;

// DTO Class (optional but recommended)
public class CategorieClientDTO {
    private Long id;
    private String code;
    private String libelle;

    // Constructors
    public CategorieClientDTO() {}

    public CategorieClientDTO(Long id, String code, String libelle) {
        this.id = id;
        this.code = code;
        this.libelle = libelle;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
}
