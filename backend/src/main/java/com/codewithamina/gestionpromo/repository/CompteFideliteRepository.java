package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.CompteFidelite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompteFideliteRepository extends JpaRepository<CompteFidelite, Long> {
    Optional<CompteFidelite> findByClientId(Long clientId);
}
