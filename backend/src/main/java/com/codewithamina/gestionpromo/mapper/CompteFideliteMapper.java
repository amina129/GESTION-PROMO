package com.codewithamina.gestionpromo.mapper;

import com.codewithamina.gestionpromo.dto.CompteFideliteDTO;
import com.codewithamina.gestionpromo.model.CompteFidelite;

public class CompteFideliteMapper {

    public static CompteFideliteDTO toDTO(CompteFidelite compte) {
        if (compte == null) return null;

        CompteFideliteDTO dto = new CompteFideliteDTO();

        dto.setId(compte.getId());
        dto.setClientId(compte.getClient() != null ? compte.getClient().getId() : null);
        dto.setPoints(compte.getPoints());

        return dto;
    }
}
