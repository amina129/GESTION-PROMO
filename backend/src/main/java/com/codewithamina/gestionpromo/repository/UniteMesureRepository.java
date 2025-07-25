package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.UniteMesure;
import com.codewithamina.gestionpromo.model.TypeUnite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniteMesureRepository extends JpaRepository<UniteMesure, Long> {

    List<UniteMesure> findByTypeUnite(TypeUnite typeUnite);

    @Query("SELECT u FROM UniteMesure u WHERE u.typeUnite.code = :typeUniteCode ORDER BY u.libelle")
    List<UniteMesure> findByTypeUniteCodeOrderByLibelle(@Param("typeUniteCode") String typeUniteCode);

    @Query("SELECT u FROM UniteMesure u JOIN FETCH u.typeUnite ORDER BY u.typeUnite.libelle, u.libelle")
    List<UniteMesure> findAllWithTypeUnite();
}