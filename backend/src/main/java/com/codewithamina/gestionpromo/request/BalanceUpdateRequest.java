package com.codewithamina.gestionpromo.request;


import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class BalanceUpdateRequest {
    private BigDecimal montant;

    public BalanceUpdateRequest(BigDecimal montant) {
        this.montant = montant;
    }

}