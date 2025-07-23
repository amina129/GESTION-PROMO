package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.CategorieClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository Interface
@Repository
public interface CategorieClientRepository extends JpaRepository<CategorieClient, Long> {
    List<CategorieClient> findAllByOrderByLibelleAsc();
}