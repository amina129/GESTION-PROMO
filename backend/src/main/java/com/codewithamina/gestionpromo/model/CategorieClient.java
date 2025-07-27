package com.codewithamina.gestionpromo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "categories_client")
public class CategorieClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String libelle;

    private String description;

    @OneToMany(mappedBy = "categorieClient", fetch = FetchType.LAZY)
    @JsonBackReference("client-categorieClient")  // Côté "enfant" - ne sera PAS sérialisé
    private List<Client> clients = new ArrayList<>();

    public CategorieClient() {}

    public CategorieClient(String code, String libelle, String description) {
        this.code = code;
        this.libelle = libelle;
        this.description = description;
    }
}