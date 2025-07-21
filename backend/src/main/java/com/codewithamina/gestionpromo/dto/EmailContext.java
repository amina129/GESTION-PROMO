package com.codewithamina.gestionpromo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailContext {
    private String clientCategory;
    private String promoType;
    private String period;
}