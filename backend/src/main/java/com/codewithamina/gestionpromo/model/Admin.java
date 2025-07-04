package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    private String nom;

    private String telephone;

    @Column(name = "est_actif")
    private Boolean estActif;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Default constructor
    public Admin() {
    }

    // Optional full constructor
    public Admin(Long id, String email, String motDePasse, String nom, String telephone,
                 Boolean estActif, LocalDateTime dateCreation, LocalDateTime dateModification, Role role) {
        this.id = id;
        this.email = email;
        this.motDePasse = motDePasse;
        this.nom = nom;
        this.telephone = telephone;
        this.estActif = estActif;
        this.dateCreation = dateCreation;
        this.dateModification = dateModification;
        this.role = role;
    }

    // Getters and setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getMotDePasse() { return motDePasse; }

    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public String getNom() { return nom; }

    public void setNom(String nom) { this.nom = nom; }

    public String getTelephone() { return telephone; }

    public void setTelephone(String telephone) { this.telephone = telephone; }

    public Boolean getEstActif() { return estActif; }

    public void setEstActif(Boolean estActif) { this.estActif = estActif; }

    public LocalDateTime getDateCreation() { return dateCreation; }

    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateModification() { return dateModification; }

    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }

    public Role getRole() { return role; }

    public void setRole(Role role) { this.role = role; }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Admin admin)) return false;
        return Objects.equals(id, admin.id) &&
                Objects.equals(email, admin.email) &&
                Objects.equals(motDePasse, admin.motDePasse) &&
                Objects.equals(nom, admin.nom) &&
                Objects.equals(telephone, admin.telephone) &&
                Objects.equals(estActif, admin.estActif) &&
                Objects.equals(dateCreation, admin.dateCreation) &&
                Objects.equals(dateModification, admin.dateModification) &&
                role == admin.role;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, motDePasse, nom, telephone, estActif, dateCreation, dateModification, role);
    }

    // Role enum
    public enum Role {
        CONSULTANT,
        MANAGER,
        ADMIN
    }
}
