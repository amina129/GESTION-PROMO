package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.TransactionFidelite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionFideliteRepository extends JpaRepository<TransactionFidelite, Long> {

    // Exemple : récupérer toutes les transactions pour un compte fidélité donné
    List<TransactionFidelite> findByCompteFideliteId(Long compteFideliteId);

    // Exemple : récupérer toutes les transactions pour un utilisateur (client) donné
    List<TransactionFidelite> findByUtilisateurId(Long utilisateurId);

    // Exemple : récupérer les transactions par type
    List<TransactionFidelite> findByTypeTransaction(String typeTransaction);
}
