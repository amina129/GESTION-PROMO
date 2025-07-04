package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

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

    // Constructors
    public PromotionCritere() {}

    public PromotionCritere(Long id, Promotion promotion, Boolean estObligatoire, Integer ordrePriorite, LocalDateTime dateCreation) {
        this.id = id;
        this.promotion = promotion;
        this.estObligatoire = estObligatoire;
        this.ordrePriorite = ordrePriorite;
        this.dateCreation = dateCreation;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Promotion getPromotion() { return promotion; }

    public void setPromotion(Promotion promotion) { this.promotion = promotion; }

    public Boolean getEstObligatoire() { return estObligatoire; }

    public void setEstObligatoire(Boolean estObligatoire) { this.estObligatoire = estObligatoire; }

    public Integer getOrdrePriorite() { return ordrePriorite; }

    public void setOrdrePriorite(Integer ordrePriorite) { this.ordrePriorite = ordrePriorite; }

    public LocalDateTime getDateCreation() { return dateCreation; }

    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    // equals and hashCode
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
