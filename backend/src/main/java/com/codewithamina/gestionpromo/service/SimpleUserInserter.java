package com.codewithamina.gestionpromo.service;

import org.springframework.stereotype.Component;

@Component
public class SimpleUserInserter {

    /*private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public SimpleUserInserter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insererConseillerVIP() {
        String sql = "INSERT INTO admin (nom, prenom, email, mot_de_passe, fonction, categories_assignees) VALUES (?, ?, ?, ?, ?, ?)";
        String motDePasseHash = passwordEncoder.encode("motdepasse123");

        jdbcTemplate.update(sql, "Moncer", "Zeineb", "zeineb.moncer@gmail.com", motDePasseHash, "CONSEILLER", "VIP");

        System.out.println("Conseiller VIP ajouté en base !");
    }*/
}
