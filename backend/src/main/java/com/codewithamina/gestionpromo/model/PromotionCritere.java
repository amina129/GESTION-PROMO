package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@Entity
@Table(name = "promotion_criteres")
public class PromotionCritere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "est_obligatoire")
    private Boolean estObligatoire;
    @Column(name = "ordre_priorite")
    private Integer ordrePriorite;
    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    public PromotionCritere() {}


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PromotionCritere that)) return false;
        return Objects.equals(id, that.id) &&
                Objects.equals(promotion, that.promotion) &&
                Objects.equals(estObligatoire, that.estObligatoire) &&
                Objects.equals(ordrePriorite, that.ordrePriorite) &&
                Objects.equals(dateCreation, that.dateCreation);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, promotion, estObligatoire, ordrePriorite, dateCreation);
    }
    @ManyToOne
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;


}
