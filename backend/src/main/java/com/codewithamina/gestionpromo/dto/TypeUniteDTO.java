package com.codewithamina.gestionpromo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@Data
public class TypeUniteDTO {
    private Long id;
    private String code;
    private String libelle;
    private List<UniteMesureDTO> unitesMesure;

}