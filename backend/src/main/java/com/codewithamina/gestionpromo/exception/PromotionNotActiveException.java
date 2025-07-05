package com.codewithamina.gestionpromo.exception;

public class PromotionNotActiveException extends RuntimeException {
    public PromotionNotActiveException(String message) {
        super(message);
    }
}
