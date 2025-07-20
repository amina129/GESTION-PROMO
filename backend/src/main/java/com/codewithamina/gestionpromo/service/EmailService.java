package com.codewithamina.gestionpromo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
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

    public void sendChartAsAttachment(MultipartFile file, String recipientEmail)
            throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(recipientEmail);
        helper.setSubject("Graphique des Statistiques");
        helper.setText("""
                Bonjour,

                Veuillez trouver ci-joint le graphique des statistiques demandé.

                Cordialement.
                """);

        InputStreamSource attachment = new ByteArrayResource(file.getBytes());
        helper.addAttachment(file.getOriginalFilename(), attachment);

        mailSender.send(message);
    }
}
