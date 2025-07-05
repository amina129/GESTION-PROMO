package com.codewithamina.gestionpromo.exception;

public class DuplicatePromotionCodeException extends RuntimeException {
    public DuplicatePromotionCodeException(String message) {
        super(message);
    }
}
