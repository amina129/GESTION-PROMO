package com.codewithamina.gestionpromo.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JWTResponse {
    private String token;
    private String username;

    public JWTResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }

}
