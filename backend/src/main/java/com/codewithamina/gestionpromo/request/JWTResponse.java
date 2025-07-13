package com.codewithamina.gestionpromo.request;

import com.codewithamina.gestionpromo.model.Fonction;

public class JWTResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private Fonction fonction;

    public JWTResponse(String token, Long id, String email, Fonction fonction) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.fonction = fonction;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getType() {
        return type;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Fonction getFonction() {
        return fonction;
    }
}