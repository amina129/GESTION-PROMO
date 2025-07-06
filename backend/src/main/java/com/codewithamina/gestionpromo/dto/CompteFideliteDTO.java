package com.codewithamina.gestionpromo.dto;


import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
public class CompteFideliteDTO {
    private Long id;
    private Long clientId;
    private BigDecimal points;
    private String niveau;
    private LocalDateTime dateCreation;
    private LocalDateTime derniereActivite;

}