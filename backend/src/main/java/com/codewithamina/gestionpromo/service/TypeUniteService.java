package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.TypeUnite;
import com.codewithamina.gestionpromo.repository.TypeUniteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TypeUniteService {

    private final TypeUniteRepository typeUniteRepository;

    public List<TypeUnite> getAllTypesUnite() {
        return typeUniteRepository.findAllOrderByLibelle();
    }

    public Optional<TypeUnite> getTypeUniteByCode(String code) {
        return typeUniteRepository.findByCode(code);
    }

    public TypeUnite saveTypeUnite(TypeUnite typeUnite) {
        return typeUniteRepository.save(typeUnite);
    }

    public void deleteTypeUnite(Long id) {
        typeUniteRepository.deleteById(id);
    }

    public boolean existsByCode(String code) {
        return typeUniteRepository.existsByCode(code);
    }
}
