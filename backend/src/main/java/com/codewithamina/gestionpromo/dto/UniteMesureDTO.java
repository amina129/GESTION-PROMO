package com.codewithamina.gestionpromo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class UniteMesureDTO {
    private Long id;
    private String code;
    private String libelle;
}