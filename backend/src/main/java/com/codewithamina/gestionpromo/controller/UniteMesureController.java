package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.model.UniteMesure;
import com.codewithamina.gestionpromo.service.UniteMesureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UniteMesureController {

    private final UniteMesureService uniteMesureService;

    @GetMapping("/unites-mesure")
    public ResponseEntity<List<UniteMesure>> getAllUnitesMesure() {
        List<UniteMesure> unitesMesure = uniteMesureService.getAllUnitesMesure();
        return ResponseEntity.ok(unitesMesure);
    }

    @GetMapping("/types-unite/{typeUniteCode}/unites-mesure")
    public ResponseEntity<List<UniteMesure>> getUnitesMesureByTypeUnite(@PathVariable String typeUniteCode) {
        List<UniteMesure> unitesMesure = uniteMesureService.getUnitesMesureByTypeUniteCode(typeUniteCode);
        return ResponseEntity.ok(unitesMesure);
    }

    @GetMapping("/unites-mesure/{id}")
    public ResponseEntity<UniteMesure> getUniteMesureById(@PathVariable Long id) {
        return uniteMesureService.getUniteMesureById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/unites-mesure")
    public ResponseEntity<UniteMesure> createUniteMesure(@RequestBody UniteMesure uniteMesure) {
        UniteMesure savedUniteMesure = uniteMesureService.saveUniteMesure(uniteMesure);
        return ResponseEntity.ok(savedUniteMesure);
    }

    @PutMapping("/unites-mesure/{id}")
    public ResponseEntity<UniteMesure> updateUniteMesure(@PathVariable Long id, @RequestBody UniteMesure uniteMesure) {
        uniteMesure.setId(id);
        UniteMesure updatedUniteMesure = uniteMesureService.saveUniteMesure(uniteMesure);
        return ResponseEntity.ok(updatedUniteMesure);
    }

    @DeleteMapping("/unites-mesure/{id}")
    public ResponseEntity<Void> deleteUniteMesure(@PathVariable Long id) {
        uniteMesureService.deleteUniteMesure(id);
        return ResponseEntity.noContent().build();
    }
}