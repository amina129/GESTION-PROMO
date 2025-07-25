package com.codewithamina.gestionpromo.service;


import com.codewithamina.gestionpromo.model.UniteMesure;
import com.codewithamina.gestionpromo.repository.TypeUniteRepository;
import com.codewithamina.gestionpromo.repository.UniteMesureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UniteMesureService {

    private final UniteMesureRepository uniteMesureRepository;
    private final TypeUniteRepository typeUniteRepository;

    public List<UniteMesure> getAllUnitesMesure() {
        return uniteMesureRepository.findAllWithTypeUnite();
    }

    public List<UniteMesure> getUnitesMesureByTypeUniteCode(String typeUniteCode) {
        return uniteMesureRepository.findByTypeUniteCodeOrderByLibelle(typeUniteCode);
    }

    public Optional<UniteMesure> getUniteMesureById(Long id) {
        return uniteMesureRepository.findById(id);
    }

    public UniteMesure saveUniteMesure(UniteMesure uniteMesure) {
        return uniteMesureRepository.save(uniteMesure);
    }

    public void deleteUniteMesure(Long id) {
        uniteMesureRepository.deleteById(id);
    }
}
