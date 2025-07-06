package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.TransactionFidelite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionFideliteRepository extends JpaRepository<TransactionFidelite, Long> {
}
