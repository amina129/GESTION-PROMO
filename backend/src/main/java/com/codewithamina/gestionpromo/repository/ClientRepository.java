package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {

    @Query("SELECT c FROM Client c WHERE " +
            "(:numeroTelephone IS NULL OR c.numeroTelephone LIKE %:numeroTelephone%) AND " +
            "(:prenom IS NULL OR c.prenom LIKE %:prenom%) AND " +
            "(:nom IS NULL OR c.nom LIKE %:nom%) AND " +
            "(:email IS NULL OR c.email LIKE %:email%) AND " +
            "(:categorieClient IS NULL OR c.categorieClient = :categorieClient)")
    List<Client> searchClients(
            @Param("numeroTelephone") String numeroTelephone,
            @Param("prenom") String prenom,
            @Param("nom") String nom,
            @Param("email") String email,
            @Param("categorieClient") String categorieClient);

    // Alternative method name for the same functionality
    @Query("SELECT c FROM Client c WHERE " +
            "(:numeroTelephone IS NULL OR c.numeroTelephone LIKE %:numeroTelephone%) AND " +
            "(:prenom IS NULL OR c.prenom LIKE %:prenom%) AND " +
            "(:nom IS NULL OR c.nom LIKE %:nom%) AND " +
            "(:email IS NULL OR c.email LIKE %:email%) AND " +
            "(:categorieClient IS NULL OR c.categorieClient = :categorieClient)")
    List<Client> findByCriteria(
            @Param("numeroTelephone") String numeroTelephone,
            @Param("prenom") String prenom,
            @Param("nom") String nom,
            @Param("email") String email,
            @Param("categorieClient") String categorieClient);

    // Additional useful methods
    List<Client> findByCategorieClient(String categorieClient);

    List<Client> findByNumeroTelephone(String numeroTelephone);

    List<Client> findByEmail(String email);

    @Query("SELECT c FROM Client c WHERE c.prenom LIKE %:prenom% OR c.nom LIKE %:nom%")
    List<Client> findByPrenomOrNomContaining(
            @Param("prenom") String prenom,
            @Param("nom") String nom);
}