package com.codewithamina.gestionpromo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @Column(name = "numero_telephone")
    @JsonProperty("numero_telephone")
    private String numeroTelephone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_client_id")
    @JsonManagedReference("client-categorieClient")  // Côté "parent" - sera sérialisé
    private CategorieClient categorieClient;

    @ManyToMany
    @JoinTable(
            name = "activations_promotion",
            joinColumns = @JoinColumn(name = "client_id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    private Set<Promotion> promotions = new HashSet<>();

    @Column(name = "id_conseiller")
    private Long idConseiller;

    public Client() {
    }

    public Client(String nom, String prenom, String email, String numeroTelephone, CategorieClient categorieClient) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.numeroTelephone = numeroTelephone;
        this.categorieClient = categorieClient;
    }

    // ✅ MÉTHODE HELPER pour obtenir le code de catégorie
    public String getCategorieCode() {
        return categorieClient != null ? categorieClient.getCode() : null;
    }

    // ✅ MÉTHODE HELPER pour obtenir le libellé de catégorie
    public String getCategorieLibelle() {
        return categorieClient != null ? categorieClient.getLibelle() : null;
    }
}