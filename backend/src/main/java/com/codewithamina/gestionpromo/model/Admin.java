package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
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
