package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Setter
@Entity
@Table(name = "promotions")
public class Promotion {

    // Getters and setters
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Getter
    @Column(name = "code_promotion", nullable = false, unique = true)
    private String codePromotion;


    @Getter
    private String nom;
    @Getter
    private String description;
    @Getter
    private BigDecimal valeur;
    @Getter
    private Integer dureeValidite;
    @Getter
    private LocalDateTime dateDebut;
    @Getter
    private LocalDateTime dateFin;
    @Getter
    private Boolean active;

    @Getter
    private Set<String> typeAbonnementsEligibles;
    @Getter
    private BigDecimal soldeMinimum;
    @Getter
    private Set<String> segmentsClientsEligibles;
    private Boolean estAutomatique;
    @Getter
    private String statut;
    @Getter
    private String type;

    // ✅ Correct relationship mapping
    @Getter
    @ManyToOne
    @JoinColumn(name = "id_categorie_promotion") // must match the FK column name in your DB
    private CategoriePromotion categoriePromotion;

    public Boolean isEstAutomatique() {
        return estAutomatique != null && estAutomatique;
    }

    public boolean isActive() {
        return active != null && active;
    }


    // All mapping rows where this promotion is the source
    @OneToMany(mappedBy = "source", cascade = CascadeType.ALL)
    private List<MappingPromotion> relationsAsSource;

    // All mapping rows where this promotion is the cible/target
    @OneToMany(mappedBy = "cible", cascade = CascadeType.ALL)
    private List<MappingPromotion> relationsAsTarget;

}
