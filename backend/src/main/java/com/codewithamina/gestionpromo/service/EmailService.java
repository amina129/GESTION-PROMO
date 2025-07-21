package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.dto.EmailContext;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from:monceramina5@gmail.com}")
    private String fromEmail;

    @Value("${app.email.max-file-size:5MB}")
    private String maxFileSize;

    // Simple method without context (for backward compatibility)
    public void sendChartAsAttachment(MultipartFile file, String recipientEmail)
            throws MessagingException, IOException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(recipientEmail);
        helper.setSubject("Statistiques - Rapport");
        helper.setText(buildSimpleEmailBody(), true);

        String fileName = "chart_" + System.currentTimeMillis() + ".png";
        InputStreamSource attachment = new ByteArrayResource(file.getBytes());
        helper.addAttachment(fileName, attachment);

        mailSender.send(message);
    }

    // Enhanced method with context
    public void sendChartAsAttachment(MultipartFile file, String recipientEmail,
                                      EmailContext context) throws MessagingException, IOException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(recipientEmail);
        helper.setSubject(buildSubject(context));
        helper.setText(buildEmailBody(context), true); // HTML support

        // Pièce jointe avec nom plus descriptif
        String fileName = buildFileName(context);
        InputStreamSource attachment = new ByteArrayResource(file.getBytes());
        helper.addAttachment(fileName, attachment);

        mailSender.send(message);
    }

    private String buildSubject(EmailContext context) {
        return String.format("Statistiques - %s %s (%s)",
                context.getClientCategory(),
                context.getPromoType(),
                context.getPeriod());
    }

    private String buildEmailBody(EmailContext context) {
        return """
        <html>
        <body>
            <h3>Rapport Statistique</h3>
            <p>Bonjour,</p>
            <p>Veuillez trouver ci-joint le graphique des statistiques d'activations :</p>
            <ul>
                <li><strong>Catégorie :</strong> %s</li>
                <li><strong>Type de promotion :</strong> %s</li>
                <li><strong>Période :</strong> %s</li>
            </ul>
            <p>Cordialement,<br/>L'équipe Gestion Promo</p>
        </body>
        </html>
        """.formatted(context.getClientCategory(), context.getPromoType(), context.getPeriod());
    }

    private String buildSimpleEmailBody() {
        return """
        <html>
        <body>
            <h3>Rapport Statistique</h3>
            <p>Bonjour,</p>
            <p>Veuillez trouver ci-joint le graphique des statistiques d'activations.</p>
            <p>Cordialement,<br/>L'équipe Gestion Promo</p>
        </body>
        </html>
        """;
    }

    private String buildFileName(EmailContext context) {
        return String.format("stats_%s_%s_%s.png",
                context.getClientCategory().replaceAll("\\s+", "_"),
                context.getPromoType().replaceAll("\\s+", "_"),
                context.getPeriod().replaceAll("\\s+", "_"));
    }
}