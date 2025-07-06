//Bonus Recharge ,Réduction Forfait,Points Fidélité,Forfait Gratuit
package com.codewithamina.gestionpromo.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Setter
@Getter
@Entity
@Table(name = "types_promotion", schema = "public")
public class TypePromotion {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;
    @Column(name = "est_actif")
    private Boolean estActif;
    @Column(name = "date_creation")
    private LocalDateTime dateCreation;
    @OneToMany(mappedBy = "type")
    private List<Promotion> promotions;


    public TypePromotion() {}


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TypePromotion)) return false;
        TypePromotion that = (TypePromotion) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(nom, that.nom) &&
                Objects.equals(description, that.description) &&
                Objects.equals(estActif, that.estActif) &&
                Objects.equals(dateCreation, that.dateCreation) ;
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, nom, description, estActif, dateCreation);
    }

}
