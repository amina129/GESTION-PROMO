package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EmailController {

    private final EmailService emailService;
    @PostMapping("/send-chart")
    public ResponseEntity<?> sendChartByEmail(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String recipientEmail) {

        try {
            emailService.sendChartAsAttachment(file, recipientEmail);
            return ResponseEntity.ok().body("{\"success\":true}");
        } catch (MessagingException | IOException e) {
            return ResponseEntity.badRequest().body("{\"success\":false,\"message\":\"" + e.getMessage() + "\"}");
        }
    }

}
