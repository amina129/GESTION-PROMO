package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.dto.ApiResponse;
import com.codewithamina.gestionpromo.dto.EmailContext;
import com.codewithamina.gestionpromo.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class EmailController {

    private final EmailService emailService;

    // Simple method without context
    @PostMapping("/send-simple")
    public ResponseEntity<?> sendSimpleChart(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String recipientEmail) {

        try {
            emailService.sendChartAsAttachment(file, recipientEmail);
            return ResponseEntity.ok().body("{\"success\":true}");
        } catch (MessagingException | IOException e) {
            return ResponseEntity.badRequest().body("{\"success\":false,\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    // Enhanced method with context
    @PostMapping("/send-chart")
    public ResponseEntity<ApiResponse> sendChartByEmail(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") @Email String recipientEmail,
            @RequestParam("clientCategory") String clientCategory,
            @RequestParam("promoType") String promoType,
            @RequestParam("period") String period) {

        try {
            EmailContext context = EmailContext.builder()
                    .clientCategory(clientCategory)
                    .promoType(promoType)
                    .period(period)
                    .build();

            emailService.sendChartAsAttachment(file, recipientEmail, context);

            return ResponseEntity.ok(ApiResponse.success("Email envoyé avec succès"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Paramètre invalide: " + e.getMessage()));

        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email", e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Erreur lors de l'envoi de l'email"));

        } catch (IOException e) {
            log.error("Erreur lors de la lecture du fichier", e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Erreur lors de la lecture du fichier"));
        }
    }
}
