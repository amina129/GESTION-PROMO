package com.codewithamina.gestionpromo.request;

import lombok.Getter;

import java.math.BigDecimal;

public class ActivationRequest {
    private String numeroTelephone;
    @Getter
    private BigDecimal montantRecharge;


    public String getPhoneNumber() {
        return numeroTelephone;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.numeroTelephone = phoneNumber;
    }


}
