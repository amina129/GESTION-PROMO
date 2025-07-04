package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNumeroTelephone(String numeroTelephone);
    Optional<Client> findByCodeClient(String codeClient);

    @Query("SELECT c.numeroTelephone FROM Client c")
    List<String> findAllPhoneNumbers();

    @Query("SELECT c FROM Client c WHERE " +
            "(:numeroTelephone IS NULL OR c.numeroTelephone LIKE %:numeroTelephone%) AND " +
            "(:nom IS NULL OR c.nom LIKE %:nom%) AND " +
            "(:prenom IS NULL OR c.prenom LIKE %:prenom%) AND " +
            "(:email IS NULL OR c.email LIKE %:email%) AND " +
            "(:codeClient IS NULL OR c.codeClient LIKE %:codeClient%) AND " +
            "(:typeAbonnement IS NULL OR c.typeAbonnement = :typeAbonnement) AND " +
            "(:statut IS NULL OR c.statut = :statut)")
    Page<Client> searchClients(@Param("numeroTelephone") String numeroTelephone,
                               @Param("nom") String nom,
                               @Param("prenom") String prenom,
                               @Param("email") String email,
                               @Param("codeClient") String codeClient,
                               @Param("typeAbonnement") String typeAbonnement,
                               @Param("statut") String statut,
                               Pageable pageable);
}