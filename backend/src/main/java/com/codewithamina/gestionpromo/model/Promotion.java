package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_promotion", nullable = false, unique = true)
    private String codePromotion;

    private String nom;
    private String description;
    private BigDecimal valeur; // Ancien champ, pourrait être déprécié
    private Integer dureeValidite;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Boolean active;
    private String statut;
    private String type;

    // Nouveaux champs basés sur le SQL
    private BigDecimal soldeMinimum;
    private BigDecimal soldeMaximum;

    // Bonus et récompenses
    private BigDecimal montantBonus;
    private BigDecimal pourcentageBonus;
    private Integer minutesBonus;
    private Integer smsBonus;
    private Integer dataBonusMb;
    private Integer pointsFidelite;

    // Limitations d'usage
    private Integer utilisationsMaxParClient;
    private Integer utilisationsMaxGlobales;

    // Configuration
    private Integer priorite;
    private Boolean estAutomatique;
    private Boolean necessiteCode;

    // Mapping PostgreSQL ARRAY vers Set<String>
    @ElementCollection

    private Set<String> typeAbonnementsEligibles;

    // Ou si vous voulez garder le mapping direct avec PostgreSQL ARRAY:
    // @Column(name = "type_abonnements_eligibles", columnDefinition = "text[]")
    // @Convert(converter = StringArrayConverter.class)
    // private Set<String> typeAbonnementsEligibles;

    private Set<String> segmentsClientsEligibles;

    @ManyToOne
    @JoinColumn(name = "id_categorie_promotion")
    private CategoriePromotion categoriePromotion;

    @OneToMany(mappedBy = "promotionSource", cascade = CascadeType.ALL)
    private List<MappingPromotion> relationsAsSource;

    @OneToMany(mappedBy = "promotionCible", cascade = CascadeType.ALL)
    private List<MappingPromotion> relationsAsTarget;

    // Méthodes utilitaires
    public Boolean isEstAutomatique() {
        return estAutomatique != null && estAutomatique;
    }

    public boolean isActive() {
        return active != null && active;
    }

    public Boolean isNecessiteCode() {
        return necessiteCode != null && necessiteCode;
    }
}