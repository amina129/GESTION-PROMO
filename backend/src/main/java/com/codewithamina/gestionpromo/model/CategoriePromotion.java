package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Objects;

@Setter
@Getter
@Entity
@Table(name = "categorie_promotion")
public class CategoriePromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;


    public CategoriePromotion() {
    }
    public CategoriePromotion(Long id, String nom, String description) {
        this.id = id;
        this.nom = nom;
        this.description = description;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CategoriePromotion that)) return false;
        return Objects.equals(id, that.id) &&
                Objects.equals(nom, that.nom) &&
                Objects.equals(description, that.description);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, nom, description);
    }
}
