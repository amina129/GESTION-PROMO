package com.codewithamina.gestionpromo.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PromotionAssignmentDto {
    @NotNull(message = "L'ID de promotion est obligatoire")
    private Long promotion_id;

    @NotNull(message = "La date de début est obligatoire")
    @FutureOrPresent(message = "La date de début doit être dans le présent ou futur")
    private LocalDate date_debut;

    @NotNull(message = "La date de fin est obligatoire")
    @Future(message = "La date de fin doit être dans le futur")
    private LocalDate date_fin;

    // Assertion personnalisée pour vérifier date_debut < date_fin
    @AssertTrue(message = "La date de début doit être avant la date de fin")
    public boolean isDateRangeValid() {
        return date_debut == null || date_fin == null || date_debut.isBefore(date_fin);
    }
}
