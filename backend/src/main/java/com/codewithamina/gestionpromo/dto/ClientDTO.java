package com.codewithamina.gestionpromo.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ClientDTO {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String fonction;

    public ClientDTO() {
    }
}
