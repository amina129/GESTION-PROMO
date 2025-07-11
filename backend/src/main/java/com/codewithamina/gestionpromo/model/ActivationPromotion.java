package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "activations_promotion")
public class ActivationPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "promotion_id", referencedColumnName = "id")
    private Promotion promotion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id", referencedColumnName = "id")
    private Client client;

    @Column(name = "date_activation", nullable = false)
    private LocalDate dateActivation;

    @Column(name = "date_expiration")
    private LocalDate dateExpiration;

    public ActivationPromotion() {
    }

    public ActivationPromotion(Promotion promotion, Client client, LocalDate dateActivation, LocalDate dateExpiration) {
        this.promotion = promotion;
        this.client = client;
        this.dateActivation = dateActivation;
        this.dateExpiration = dateExpiration;
    }
}