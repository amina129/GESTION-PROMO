package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.CategorieClient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategorieClientRepository extends JpaRepository<CategorieClient, Long> {
    List<CategorieClient> findAllByOrderByLibelleAsc();
}
