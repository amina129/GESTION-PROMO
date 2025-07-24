package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.CategorieClientDTO;
import com.codewithamina.gestionpromo.service.CategorieClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ClientCategorieController {

    private final CategorieClientService categorieClientService;

    public ClientCategorieController(CategorieClientService categorieClientService) {
        this.categorieClientService = categorieClientService;
    }

    @GetMapping("/categories-client")
    public ResponseEntity<List<CategorieClientDTO>> getCategoriesClient() {
        List<CategorieClientDTO> categories = categorieClientService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}
