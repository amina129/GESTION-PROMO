package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.CritereEligibilite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CritereEligibiliteRepository extends JpaRepository<CritereEligibilite, Long> {
    // Tu peux ajouter des méthodes personnalisées si nécessaire,
    // par exemple rechercher par nom ou par estActif.
}
