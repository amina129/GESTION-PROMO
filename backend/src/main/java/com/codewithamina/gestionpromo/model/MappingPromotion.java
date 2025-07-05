package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "mapping_promotions")
public class MappingPromotion {

    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Source promotion
    @Setter
    @Getter
    @ManyToOne
    @JoinColumn(name = "promotion_source_id", nullable = false)
    private Promotion promotionSource;

    // Target promotion
    @Setter
    @Getter
    @ManyToOne
    @JoinColumn(name = "promotion_cible_id", nullable = false)
    private Promotion promotionCible;

    @Setter
    @Getter
    @Column(name = "type_relation")
    private String typeRelation;

    @Setter
    @Getter
    private String description;

    @Setter
    @Getter
    @Column(name = "est_actif")
    private Boolean estActif;

    @Setter
    @Getter
    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    public MappingPromotion() {
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MappingPromotion that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    @ManyToOne
    @JoinColumn(name = "promotion_source_id")
    private Promotion source;

    @ManyToOne
    @JoinColumn(name = "promotion_cible_id")
    private Promotion target;
    @ManyToOne
    @JoinColumn(name = "promotion_cible_id")
    private Promotion cible;


}
