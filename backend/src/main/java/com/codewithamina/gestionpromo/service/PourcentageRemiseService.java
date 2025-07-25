package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.PourcentageRemise;
import com.codewithamina.gestionpromo.repository.PourcentageRemiseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PourcentageRemiseService {

    private final PourcentageRemiseRepository pourcentageRemiseRepository;

    public List<PourcentageRemise> getAllPourcentagesRemise() {
        return pourcentageRemiseRepository.findAllOrderByValeur();
    }

    public List<PourcentageRemise> getAllActivePourcentagesRemise() {
        return pourcentageRemiseRepository.findAllActiveOrderByValeur();
    }

    public Optional<PourcentageRemise> getPourcentageRemiseById(Long id) {
        return pourcentageRemiseRepository.findById(id);
    }

    public PourcentageRemise savePourcentageRemise(PourcentageRemise pourcentageRemise) {
        return pourcentageRemiseRepository.save(pourcentageRemise);
    }

    public void deletePourcentageRemise(Long id) {
        pourcentageRemiseRepository.deleteById(id);
    }
}