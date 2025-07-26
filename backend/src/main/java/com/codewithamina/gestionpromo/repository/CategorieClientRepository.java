package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.CategorieClient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategorieClientRepository extends JpaRepository<CategorieClient, Long> {
    List<CategorieClient> findAllByOrderByLibelleAsc();
    Optional<CategorieClient> findByCode(String code);

    boolean existsByCode(String code);
}
