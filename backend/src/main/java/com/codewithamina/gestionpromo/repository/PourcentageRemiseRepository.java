package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.PourcentageRemise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PourcentageRemiseRepository extends JpaRepository<PourcentageRemise, Long> {

    @Query("SELECT p FROM PourcentageRemise p WHERE p.actif = true ORDER BY p.valeur")
    List<PourcentageRemise> findAllActiveOrderByValeur();

    @Query("SELECT p FROM PourcentageRemise p ORDER BY p.valeur")
    List<PourcentageRemise> findAllOrderByValeur();
}