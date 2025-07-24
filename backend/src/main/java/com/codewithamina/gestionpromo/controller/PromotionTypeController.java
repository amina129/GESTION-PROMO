package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.SousTypePromotionDTO;
import com.codewithamina.gestionpromo.dto.TypePromotionDTO;
import com.codewithamina.gestionpromo.repository.SousTypePromotionRepository;
import com.codewithamina.gestionpromo.repository.TypePromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/promotion-types")
@RequiredArgsConstructor
public class PromotionTypeController {

    private final TypePromotionRepository typePromotionRepository;
    private final SousTypePromotionRepository sousTypePromotionRepository;

    @GetMapping
    public List<TypePromotionDTO> getAllTypes() {
        return typePromotionRepository.findAll().stream()
                .map(type -> new TypePromotionDTO(type.getCode(), type.getLibelle()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{typeCode}/sous-types")
    public List<SousTypePromotionDTO> getSousTypesByType(@PathVariable String typeCode) {
        return sousTypePromotionRepository.findByTypePromotionCode(typeCode).stream()
                .map(sous -> new SousTypePromotionDTO(
                        sous.getId(),     // Long id
                        sous.getCode(),   // String code
                        sous.getLibelle() // String libelle
                ))
                .collect(Collectors.toList());
    }
}
