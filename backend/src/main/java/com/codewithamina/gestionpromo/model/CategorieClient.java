package com.codewithamina.gestionpromo.model;

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
    // Getters et Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String libelle;

    private String description;

    @OneToMany(mappedBy = "categorieClient", fetch = FetchType.LAZY)
    private List<Client> clients = new ArrayList<>();

    public CategorieClient() {}
}