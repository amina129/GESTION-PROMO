package com.codewithamina.gestionpromo.controller;

import com.codewithamina.gestionpromo.config.AdminDetails;
import com.codewithamina.gestionpromo.config.JwtUtils;
import com.codewithamina.gestionpromo.request.JWTResponse;
import com.codewithamina.gestionpromo.request.LoginRequest;
import com.codewithamina.gestionpromo.request.MessageResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        AdminDetails adminDetails = (AdminDetails) authentication.getPrincipal();

        return ResponseEntity.ok(new JWTResponse(
                jwt,
                adminDetails.getId(),
                adminDetails.getUsername(),
                adminDetails.getFonction() // Add role to response
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new MessageResponse("Déconnexion réussie."));
    }


}