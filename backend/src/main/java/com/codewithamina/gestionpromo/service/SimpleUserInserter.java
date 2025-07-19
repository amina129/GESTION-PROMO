package com.codewithamina.gestionpromo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SimpleUserInserter {

   /* private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder;

    public SimpleUserInserter(JdbcTemplate jdbcTemplate,
                              BCryptPasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public void insererConseillerVIP() {
        try {
            String sql = "INSERT INTO admin (nom, prenom, email, mot_de_passe, fonction, categories_assignees) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";

            String motDePasseHash = passwordEncoder.encode("amine123");

            int rowsAffected = jdbcTemplate.update(sql,
                    "moncer",
                    "amine",
                    "amine.moncer@gmail.com",
                    motDePasseHash,
                    "CONSEILLER",
                    "GP");

            if (rowsAffected > 0) {
                System.out.println("Conseiller GP ajouté avec succès !");
            } else {
                System.out.println("Aucune ligne affectée - insertion échouée");
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de l'insertion du conseiller:");
            e.printStackTrace();
        }
    }*/
}