package com.codewithamina.gestionpromo.request;

import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

@Getter
@Setter
public class ActivationRequest {

    @JsonProperty("numeroTelephone")
    private String numeroTelephone;

    private BigDecimal montantRecharge;
}