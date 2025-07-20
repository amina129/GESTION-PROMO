package com.codewithamina.gestionpromo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrendDataDto {
    private String month;
    private int activations;
}
