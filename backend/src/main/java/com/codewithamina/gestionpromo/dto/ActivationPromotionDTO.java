package com.codewithamina.gestionpromo.dto;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Setter
@Getter
public class ActivationPromotionDTO {

    private Long id;
    private Long promotionId;
    private Long clientId;
    private LocalDateTime dateActivation;
    private LocalDateTime dateExpiration;

    public ActivationPromotionDTO() {
    }

    @Override
    public String toString() {
        return "ActivationPromotionDTO{" +
                "id=" + id +
                ", promotionId=" + promotionId +
                ", clientId=" + clientId +
                ", dateActivation=" + dateActivation +
                ", dateExpiration=" + dateExpiration +
                '}';
    }
}
