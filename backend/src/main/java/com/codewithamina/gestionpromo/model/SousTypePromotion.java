package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sous_types_promotion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SousTypePromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String libelle;

    @ManyToOne
    @JoinColumn(name = "type_promotion_code", referencedColumnName = "code")
    private TypePromotion typePromotion;
}
