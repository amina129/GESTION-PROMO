package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

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

    // Many transactions belong to one utilisateur (client)
    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Client utilisateur;

    // Constructors, getters, setters, equals, hashCode

    public TransactionFidelite() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CompteFidelite getCompteFidelite() {
        return compteFidelite;
    }

    public void setCompteFidelite(CompteFidelite compteFidelite) {
        this.compteFidelite = compteFidelite;
    }

    public String getTypeTransaction() {
        return typeTransaction;
    }

    public void setTypeTransaction(String typeTransaction) {
        this.typeTransaction = typeTransaction;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReferenceExterne() {
        return referenceExterne;
    }

    public void setReferenceExterne(String referenceExterne) {
        this.referenceExterne = referenceExterne;
    }

    public LocalDateTime getDateTransaction() {
        return dateTransaction;
    }

    public void setDateTransaction(LocalDateTime dateTransaction) {
        this.dateTransaction = dateTransaction;
    }

    public LocalDateTime getExpireLe() {
        return expireLe;
    }

    public void setExpireLe(LocalDateTime expireLe) {
        this.expireLe = expireLe;
    }

    public Client getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Client utilisateur) {
        this.utilisateur = utilisateur;
    }

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
