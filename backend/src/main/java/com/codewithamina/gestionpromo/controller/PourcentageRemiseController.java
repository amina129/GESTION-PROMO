package com.codewithamina.gestionpromo.controller;


import com.codewithamina.gestionpromo.model.PourcentageRemise;
import com.codewithamina.gestionpromo.service.PourcentageRemiseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pourcentages-remise")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PourcentageRemiseController {

    private final PourcentageRemiseService pourcentageRemiseService;

    @GetMapping
    public ResponseEntity<List<PourcentageRemise>> getAllPourcentagesRemise() {
        List<PourcentageRemise> pourcentages = pourcentageRemiseService.getAllActivePourcentagesRemise();
        return ResponseEntity.ok(pourcentages);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PourcentageRemise>> getAllPourcentagesRemiseWithInactive() {
        List<PourcentageRemise> pourcentages = pourcentageRemiseService.getAllPourcentagesRemise();
        return ResponseEntity.ok(pourcentages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PourcentageRemise> getPourcentageRemiseById(@PathVariable Long id) {
        return pourcentageRemiseService.getPourcentageRemiseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PourcentageRemise> createPourcentageRemise(@RequestBody PourcentageRemise pourcentageRemise) {
        PourcentageRemise savedPourcentage = pourcentageRemiseService.savePourcentageRemise(pourcentageRemise);
        return ResponseEntity.ok(savedPourcentage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PourcentageRemise> updatePourcentageRemise(@PathVariable Long id, @RequestBody PourcentageRemise pourcentageRemise) {
        pourcentageRemise.setId(id);
        PourcentageRemise updatedPourcentage = pourcentageRemiseService.savePourcentageRemise(pourcentageRemise);
        return ResponseEntity.ok(updatedPourcentage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePourcentageRemise(@PathVariable Long id) {
        pourcentageRemiseService.deletePourcentageRemise(id);
        return ResponseEntity.noContent().build();
    }
}