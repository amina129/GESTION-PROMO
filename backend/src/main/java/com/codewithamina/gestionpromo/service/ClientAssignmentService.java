package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Admin;
import com.codewithamina.gestionpromo.model.Fonction;
import com.codewithamina.gestionpromo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientAssignmentService {
    @Autowired
    private AdminRepository adminRepository;

    public Admin assignConseillerToClient(String categorieClient) {
        return adminRepository.findByFonctionAndCategoriesAssigneesContaining(
                Fonction.CONSEILLER,
                categorieClient
        ).stream().findFirst().orElse(null);
    }
}