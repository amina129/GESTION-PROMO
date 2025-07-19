package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

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
    private String numeroTelephone;
    private String categorieClient;
    @ManyToMany
    @JoinTable(
            name = "activations_promotion",
            joinColumns = @JoinColumn(name = "client_id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    private Set<Promotion> promotions = new HashSet<>();


    public Client() {
    }

    public Client(String nom, String prenom, String email, String motDePasse, String fonction) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.categorieClient = categorieClient;
        this.numeroTelephone = numeroTelephone;}


    @Column(name = "id_conseiller")
    private Long idConseiller;
}
