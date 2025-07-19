package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Admin;
import com.codewithamina.gestionpromo.model.Fonction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
    List<Admin> findByFonctionAndCategoriesAssigneesContaining(Fonction fonction, String categorie);
}
