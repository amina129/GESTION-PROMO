package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@Entity
@Table(name = "criteres_eligibilite")
public class CritereEligibilite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    @Column(name = "type_critere")
    private String typeCritere;
    private String operateur;
    @Column(name = "valeur_numerique")
    private Double valeurNumerique;
    @Column(name = "valeur_texte")
    private String valeurTexte;
    @Column(name = "valeurs_multiples")
    private String valeursMultiples; // Could be CSV or JSON depending on your design
    @Column(name = "est_actif")
    private Boolean estActif;
    @Column(name = "date_creation")
    private LocalDateTime dateCreation;


    public CritereEligibilite() {}

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CritereEligibilite)) return false;
        CritereEligibilite that = (CritereEligibilite) o;
        return Objects.equals(id, that.id);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
