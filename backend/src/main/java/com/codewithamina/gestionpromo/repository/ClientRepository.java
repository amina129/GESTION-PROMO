package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {

    @Query("SELECT c FROM Client c " +
            "WHERE (:userRole = 'ADMIN' OR c.idConseiller = :currentUserId) " +
            "AND (:numeroTelephone IS NULL OR c.numeroTelephone LIKE %:numeroTelephone%) " +
            "AND (:prenom IS NULL OR c.prenom LIKE %:prenom%) " +
            "AND (:nom IS NULL OR c.nom LIKE %:nom%) " +
            "AND (:email IS NULL OR c.email LIKE %:email%) " +
            "AND (:categorieClient IS NULL OR c.categorieClient = :categorieClient)")
    List<Client> findByCriteriaWithRoleCheck(
            @Param("currentUserId") Long currentUserId,
            @Param("userRole") String userRole,
            @Param("numeroTelephone") String numeroTelephone,
            @Param("prenom") String prenom,
            @Param("nom") String nom,
            @Param("email") String email,
            @Param("categorieClient") String categorieClient
    );
    @Query("SELECT COUNT(c) FROM Client c")
    long countAllClients();
}