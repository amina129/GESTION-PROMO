package com.codewithamina.gestionpromo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class UpdatePromotionRequest {

    @NotBlank
    private String description;
    @NotNull
    private LocalDateTime dateDebut;
    @NotNull
    private LocalDateTime dateFin;

}
