package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;

    private String fonction;

    public Client() {
    }

    public Client(String nom, String prenom, String email, String motDePasse, String fonction) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.fonction = fonction;
    }
}
