package com.codewithamina.gestionpromo.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@Entity
@Table(name = "statistiques_promotions")
public class StatistiquesPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;

    @Column(name = "date_statistique")
    private LocalDate dateStatistique;
    @Column(name = "nombre_activations")
    private Integer nombreActivations;
    @Column(name = "nombre_utilisations")
    private Integer nombreUtilisations;
    @Column(name = "montant_total_bonus")
    private BigDecimal montantTotalBonus;
    @Column(name = "taux_conversion")
    private Double tauxConversion;
    @Column(name = "taux_utilisation")
    private Double tauxUtilisation;
    @Column(name = "repartition_par_segment", columnDefinition = "TEXT")
    private String repartitionParSegment;
    @Column(name = "repartition_par_type_abonnement", columnDefinition = "TEXT")
    private String repartitionParTypeAbonnement;
    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    public StatistiquesPromotion() {}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StatistiquesPromotion that)) return false;
        return Objects.equals(id, that.id) &&
                Objects.equals(promotion, that.promotion) &&
                Objects.equals(dateStatistique, that.dateStatistique);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, promotion, dateStatistique);
    }
}
