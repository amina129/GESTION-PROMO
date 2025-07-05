package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "activations_promotion")
public class ActivationPromotion {
    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @Setter
    @Getter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Setter
    @Getter
    private LocalDateTime dateActivation;
    @Setter
    @Getter
    private LocalDateTime dateExpiration;
    @Setter
    @Getter
    private BigDecimal montantRecharge;
    @Setter
    @Getter
    private String statut; // ACTIVE, EXPIRED, USED



    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Client utilisateur;

}