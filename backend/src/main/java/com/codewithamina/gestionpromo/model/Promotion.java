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
    private BigDecimal valeur;
    private Integer dureeValidite;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Boolean active;
    private Set<String> typeAbonnementsEligibles;
    private BigDecimal soldeMinimum;
    private Set<String> segmentsClientsEligibles;
    private Boolean estAutomatique;
    private String statut;
    private String type;
    @ManyToOne
    @JoinColumn(name = "id_categorie_promotion") // must match the FK column name in your DB
    private CategoriePromotion categoriePromotion;


    public Boolean isEstAutomatique() {
        return estAutomatique != null && estAutomatique;
    }
    public boolean isActive() {
        return active != null && active;
    }

    @OneToMany(mappedBy = "promotionSource", cascade = CascadeType.ALL)
    private List<MappingPromotion> relationsAsSource;
    @OneToMany(mappedBy = "promotionCible", cascade = CascadeType.ALL)
    private List<MappingPromotion> relationsAsTarget;

}
