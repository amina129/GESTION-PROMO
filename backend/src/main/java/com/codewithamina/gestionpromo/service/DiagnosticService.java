package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.model.Client;
import com.codewithamina.gestionpromo.model.Promotion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiagnosticService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Diagnostic complet pour identifier pourquoi un client n'a pas de promotions éligibles
     */
    public void diagnosticEligibilite(String codeClient) {
        System.out.println("=== DIAGNOSTIC D'ELIGIBILITE ===");

        // 1. Récupérer le client
        Client client = getClientByCode(codeClient);
        if (client == null) {
            System.out.println("❌ Client non trouvé avec le code: " + codeClient);
            return;
        }

        System.out.println("✅ Client trouvé: " + client.getPrenom() + " " + client.getNom());
        System.out.println("   - Statut: " + client.getStatut());
        System.out.println("   - Type abonnement: " + client.getTypeAbonnement());
        System.out.println("   - Solde: " + client.getSolde());

        // 2. Récupérer toutes les promotions
        List<Promotion> allPromotions = getAllPromotions();
        System.out.println("\n📋 Nombre total de promotions: " + allPromotions.size());

        // 3. Analyser chaque promotion
        for (Promotion promo : allPromotions) {
            System.out.println("\n🔍 Analyse de la promotion: " + promo.getCodePromotion());
            analysePromotion(client, promo);
        }

        // 4. Test de la requête JPQL
        testRequeteJPQL(client);
    }

    private void analysePromotion(Client client, Promotion promo) {
        System.out.println("   - Nom: " + promo.getNom());
        System.out.println("   - Statut: " + promo.getStatut());
        System.out.println("   - Active: " + promo.isActive());
        System.out.println("   - Automatique: " + promo.isEstAutomatique());
        System.out.println("   - Date début: " + promo.getDateDebut());
        System.out.println("   - Date fin: " + promo.getDateFin());
        System.out.println("   - Solde minimum: " + promo.getSoldeMinimum());
        System.out.println("   - Types abonnements éligibles: " + promo.getTypeAbonnementsEligibles());

        // Vérifications détaillées
        LocalDateTime now = LocalDateTime.now();

        // Vérification statut promotion
        if (!"ACTIVE".equalsIgnoreCase(promo.getStatut())) {
            System.out.println("   ❌ Statut promotion invalide: " + promo.getStatut());
        }

        // Vérification active
        if (!promo.isActive()) {
            System.out.println("   ❌ Promotion non active");
        }

        // Vérification période
        if (promo.getDateDebut() == null || promo.getDateFin() == null) {
            System.out.println("   ❌ Dates manquantes");
        } else if (now.isBefore(promo.getDateDebut())) {
            System.out.println("   ❌ Promotion pas encore démarrée");
        } else if (now.isAfter(promo.getDateFin())) {
            System.out.println("   ❌ Promotion expirée");
        } else {
            System.out.println("   ✅ Période valide");
        }

        // Vérification solde
        if (promo.getSoldeMinimum() != null) {
            if (client.getSolde() == null) {
                System.out.println("   ❌ Solde client null");
            } else if (client.getSolde().compareTo(promo.getSoldeMinimum()) < 0) {
                System.out.println("   ❌ Solde insuffisant: " + client.getSolde() + " < " + promo.getSoldeMinimum());
            } else {
                System.out.println("   ✅ Solde suffisant");
            }
        }

        // Vérification type abonnement
        if (promo.getTypeAbonnementsEligibles() != null && !promo.getTypeAbonnementsEligibles().isEmpty()) {
            if (client.getTypeAbonnement() == null) {
                System.out.println("   ❌ Type abonnement client null");
            } else if (!promo.getTypeAbonnementsEligibles().contains(client.getTypeAbonnement())) {
                System.out.println("   ❌ Type abonnement non éligible: " + client.getTypeAbonnement() +
                        " pas dans " + promo.getTypeAbonnementsEligibles());
            } else {
                System.out.println("   ✅ Type abonnement éligible");
            }
        }

        // Vérification statut client
        if (!"ACTIF".equalsIgnoreCase(client.getStatut())) {
            System.out.println("   ❌ Statut client invalide: " + client.getStatut());
        }
    }

    private void testRequeteJPQL(Client client) {
        System.out.println("\n🔍 Test de la requête JPQL:");

        String jpql = "SELECT p FROM Promotion p WHERE p.active = true " +
                "AND p.statut = 'ACTIVE' " +
                "AND p.estAutomatique = true " +
                "AND CURRENT_TIMESTAMP BETWEEN p.dateDebut AND p.dateFin";

        System.out.println("Requête: " + jpql);

        TypedQuery<Promotion> query = entityManager.createQuery(jpql, Promotion.class);
        List<Promotion> results = query.getResultList();

        System.out.println("Résultats de la requête JPQL: " + results.size() + " promotions");

        for (Promotion p : results) {
            System.out.println("   - " + p.getCodePromotion() + " (" + p.getNom() + ")");
        }
    }

    private Client getClientByCode(String codeClient) {
        try {
            TypedQuery<Client> query = entityManager.createQuery(
                    "SELECT c FROM Client c WHERE c.codeClient = :code", Client.class);
            query.setParameter("code", codeClient);
            return query.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    private List<Promotion> getAllPromotions() {
        TypedQuery<Promotion> query = entityManager.createQuery(
                "SELECT p FROM Promotion p", Promotion.class);
        return query.getResultList();
    }

    /**
     * Méthode pour tester l'mapping des types d'abonnement
     */
    public void testTypeAbonnementMapping() {
        System.out.println("\n=== TEST MAPPING TYPE ABONNEMENT ===");

        List<Promotion> promotions = getAllPromotions();
        for (Promotion p : promotions) {
            System.out.println("Promotion: " + p.getCodePromotion());
            System.out.println("   Types éligibles: " + p.getTypeAbonnementsEligibles());
            System.out.println("   Classe: " + (p.getTypeAbonnementsEligibles() != null ?
                    p.getTypeAbonnementsEligibles().getClass().getName() : "null"));
        }
    }
}