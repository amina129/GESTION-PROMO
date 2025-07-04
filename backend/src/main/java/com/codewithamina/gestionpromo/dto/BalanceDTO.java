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

    public BalanceDTO() {}

    public BigDecimal getSolde() {
        return solde;
    }

    public void setSolde(BigDecimal solde) {
        this.solde = solde;
    }

    public LocalDateTime getDerniereRecharge() {
        return derniereRecharge;
    }

    public void setDerniereRecharge(LocalDateTime derniereRecharge) {
        this.derniereRecharge = derniereRecharge;
    }
}
