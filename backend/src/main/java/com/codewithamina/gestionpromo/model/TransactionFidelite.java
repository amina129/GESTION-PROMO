package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;

@Setter
@Getter
@Entity
@Table(name = "transactions_fidelite")
public class TransactionFidelite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "compte_fidelite_id", nullable = false)
    private CompteFidelite compteFidelite;
    @Column(name = "type_transaction")
    private String typeTransaction;
    private Integer points;
    private String description;
    @Column(name = "reference_externe")
    private String referenceExterne;
    @Column(name = "date_transaction")
    private LocalDateTime dateTransaction;
    @Column(name = "expire_le")
    private LocalDateTime expireLe;
    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Client utilisateur;


    public TransactionFidelite() {}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TransactionFidelite)) return false;
        TransactionFidelite that = (TransactionFidelite) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(compteFidelite, that.compteFidelite) &&
                Objects.equals(typeTransaction, that.typeTransaction) &&
                Objects.equals(points, that.points) &&
                Objects.equals(description, that.description) &&
                Objects.equals(referenceExterne, that.referenceExterne) &&
                Objects.equals(dateTransaction, that.dateTransaction) &&
                Objects.equals(expireLe, that.expireLe) &&
                Objects.equals(utilisateur, that.utilisateur);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, compteFidelite, typeTransaction, points, description, referenceExterne, dateTransaction, expireLe, utilisateur);
    }
}
