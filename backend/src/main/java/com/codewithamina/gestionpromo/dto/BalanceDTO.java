package com.codewithamina.gestionpromo.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
public class BalanceDTO {
    private BigDecimal solde;
    private LocalDateTime derniereRecharge;

    public BalanceDTO(BigDecimal solde, LocalDateTime derniereRecharge) {
        this.solde = solde;
        this.derniereRecharge = derniereRecharge;
    }

    public BalanceDTO() {}

}
