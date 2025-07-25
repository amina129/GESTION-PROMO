package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.TypeUnite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TypeUniteRepository extends JpaRepository<TypeUnite, Long> {

    Optional<TypeUnite> findByCode(String code);

    @Query("SELECT t FROM TypeUnite t ORDER BY t.libelle")
    List<TypeUnite> findAllOrderByLibelle();

    boolean existsByCode(String code);
}