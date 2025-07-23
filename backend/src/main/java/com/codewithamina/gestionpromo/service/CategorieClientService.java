package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.CategorieClientDTO;
import com.codewithamina.gestionpromo.model.CategorieClient;
import com.codewithamina.gestionpromo.repository.CategorieClientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Service Class
@Service
@Transactional
public class CategorieClientService {

    @Autowired
    private CategorieClientRepository categorieClientRepository;

    public List<CategorieClientDTO> getAllCategories() {
        List<CategorieClient> categories = categorieClientRepository.findAllByOrderByLibelleAsc();
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CategorieClientDTO convertToDTO(CategorieClient categorieClient) {
        return new CategorieClientDTO(
                categorieClient.getId(),
                categorieClient.getCode(),
                categorieClient.getLibelle()
        );
    }
}
