package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SousTypePromotionDTO {
    private Long id;
    private String code;
    private String libelle;
}
