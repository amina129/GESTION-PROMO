package com.codewithamina.gestionpromo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategorieClientRepository extends JpaRepository<CategorieClient, Long> {

}
