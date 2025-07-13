package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.config.JwtUtils;
import com.codewithamina.gestionpromo.model.Admin;
import com.codewithamina.gestionpromo.repository.AdminRepository;
import com.codewithamina.gestionpromo.request.JWTResponse;
import com.codewithamina.gestionpromo.request.LoginRequest;
import com.codewithamina.gestionpromo.request.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        System.out.println("=== AUTHENTICATION DEBUG ===");
        System.out.println("Password provided: " + loginRequest.getPassword());
        System.out.println("Password length: " + loginRequest.getPassword().length());
        System.out.println("============================");
        try {
            // L'AuthenticationManager se charge de vérifier les credentials
            // via le UserDetailsService et le PasswordEncoder
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Générer le token JWT
            String jwt = jwtUtils.generateJwtToken(authentication);

            return ResponseEntity.ok(new JWTResponse(jwt, loginRequest.getUsername()));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Identifiants invalides"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Erreur d'authentification : " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur serveur : " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new MessageResponse("Déconnexion réussie."));
    }
    @RestController
    @RequestMapping("/api/test")
    @CrossOrigin(origins = "http://localhost:3000")
    public class TestController {

        @Autowired
        private AdminRepository adminRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @PostMapping("/create-admin")
        public ResponseEntity<?> createTestAdmin() {
            Admin admin = new Admin();
            admin.setEmail("test@example.com");
            admin.setNom("Test");
            admin.setPrenom("Admin");
            admin.setFonction("Administrator");
            admin.setMotDePasse(passwordEncoder.encode("admin123")); // Encode the password

            adminRepository.save(admin);

            return ResponseEntity.ok(new MessageResponse("Test admin created successfully"));
        }
    }

}