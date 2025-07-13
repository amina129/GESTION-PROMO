package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.model.Admin;
import com.codewithamina.gestionpromo.repository.AdminRepository;
import com.codewithamina.gestionpromo.request.JWTResponse;
import com.codewithamina.gestionpromo.request.LoginRequest;
import com.codewithamina.gestionpromo.request.MessageResponse;
import com.codewithamina.gestionpromo.config.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Vérifier si l'admin existe par email
            Optional<Admin> optionalAdmin = adminRepository.findByEmail(loginRequest.getUsername());

            if (optionalAdmin.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Admin non trouvé avec cet email."));
            }

            Admin admin = optionalAdmin.get();

            // Vérifier le mot de passe (en clair ou encodé selon ton système)
            if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getMotDePasse())) {
                throw new BadCredentialsException("Mot de passe invalide.");
            }

            // Authentifier avec Spring Security (nécessite que UserDetailsService soit correctement configuré)
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur d'authentification : " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new MessageResponse("Déconnexion réussie."));
    }
}
