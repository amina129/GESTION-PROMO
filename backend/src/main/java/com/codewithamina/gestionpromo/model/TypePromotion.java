package com.codewithamina.gestionpromo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "types_promotion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypePromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String libelle;

    @OneToMany(mappedBy = "typePromotion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SousTypePromotion> sousTypes;
}