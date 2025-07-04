package com.codewithamina.gestionpromo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BalanceDTO {
    private BigDecimal solde;
    private LocalDateTime derniereRecharge;

    public BalanceDTO(BigDecimal solde, LocalDateTime derniereRecharge) {
        this.solde = solde;
        this.derniereRecharge = derniereRecharge;
    }

    // Getters, setters
}