package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.TypeUniteDTO;
import com.codewithamina.gestionpromo.dto.UniteMesureDTO;
import com.codewithamina.gestionpromo.model.TypeUnite;
import com.codewithamina.gestionpromo.service.TypeUniteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/types-unite")
@RequiredArgsConstructor
@Slf4j
public class TypeUniteController {

    private final TypeUniteService typeUniteService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<TypeUniteDTO>> getAllTypesUnite() {
        try {
            log.info("Début de récupération de tous les types d'unité");

            List<TypeUnite> typesUnite = typeUniteService.getAllTypesUnite();
            List<TypeUniteDTO> dtos = typesUnite.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            log.info("Types d'unité récupérés avec succès. Nombre: {}", dtos.size());
            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            log.error("Erreur lors de la récupération des types d'unité", e);
            throw e;
        }
    }

    @GetMapping("/{code}")
    public ResponseEntity<TypeUniteDTO> getTypeUniteByCode(@PathVariable String code) {
        try {
            log.info("Récupération du type d'unité avec le code: {}", code);

            return typeUniteService.getTypeUniteByCode(code)
                    .map(typeUnite -> {
                        TypeUniteDTO dto = convertToDto(typeUnite);
                        log.info("Type d'unité trouvé: {}", dto);
                        return ResponseEntity.ok(dto);
                    })
                    .orElseGet(() -> {
                        log.warn("Type d'unité non trouvé pour le code: {}", code);
                        return ResponseEntity.notFound().build();
                    });

        } catch (Exception e) {
            log.error("Erreur lors de la récupération du type d'unité avec code: {}", code, e);
            throw e;
        }
    }

    @PostMapping
    public ResponseEntity<TypeUniteDTO> createTypeUnite(@RequestBody TypeUniteDTO typeUniteDTO) {
        try {
            log.info("Création d'un nouveau type d'unité: {}", typeUniteDTO);

            if (typeUniteService.existsByCode(typeUniteDTO.getCode())) {
                log.warn("Type d'unité existe déjà avec le code: {}", typeUniteDTO.getCode());
                return ResponseEntity.badRequest().build();
            }

            TypeUnite typeUnite = convertToEntity(typeUniteDTO);
            TypeUnite savedTypeUnite = typeUniteService.saveTypeUnite(typeUnite);
            TypeUniteDTO savedDto = convertToDto(savedTypeUnite);

            log.info("Type d'unité créé avec succès: {}", savedDto);
            return ResponseEntity.ok(savedDto);

        } catch (Exception e) {
            log.error("Erreur lors de la création du type d'unité: {}", typeUniteDTO, e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TypeUniteDTO> updateTypeUnite(@PathVariable Long id, @RequestBody TypeUniteDTO typeUniteDTO) {
        try {
            log.info("Mise à jour du type d'unité avec ID: {}, données: {}", id, typeUniteDTO);

            typeUniteDTO.setId(id);
            TypeUnite typeUnite = convertToEntity(typeUniteDTO);
            TypeUnite updatedTypeUnite = typeUniteService.saveTypeUnite(typeUnite);
            TypeUniteDTO updatedDto = convertToDto(updatedTypeUnite);

            log.info("Type d'unité mis à jour avec succès: {}", updatedDto);
            return ResponseEntity.ok(updatedDto);

        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du type d'unité avec ID: {}", id, e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTypeUnite(@PathVariable Long id) {
        try {
            log.info("Suppression du type d'unité avec ID: {}", id);

            typeUniteService.deleteTypeUnite(id);

            log.info("Type d'unité supprimé avec succès avec ID: {}", id);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            log.error("Erreur lors de la suppression du type d'unité avec ID: {}", id, e);
            throw e;
        }
    }

    private TypeUniteDTO convertToDto(TypeUnite typeUnite) {
        TypeUniteDTO dto = modelMapper.map(typeUnite, TypeUniteDTO.class);
        if (typeUnite.getUnitesMesure() != null) {
            dto.setUnitesMesure(typeUnite.getUnitesMesure().stream()
                    .map(um -> modelMapper.map(um, UniteMesureDTO.class))
                    .collect(Collectors.toList()));
        }
        return dto;
    }


    private TypeUnite convertToEntity(TypeUniteDTO dto) {
        return modelMapper.map(dto, TypeUnite.class);
    }
}