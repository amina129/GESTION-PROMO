package com.codewithamina.gestionpromo.config;

import com.codewithamina.gestionpromo.model.Admin;
import com.codewithamina.gestionpromo.model.Fonction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class AdminDetails implements UserDetails {
    private final Admin admin;

    public AdminDetails(Admin admin) {
        this.admin = admin;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convertit la fonction en rôle Spring Security
        String role = "ROLE_" + admin.getFonction().name();
        return Collections.singletonList(
                new SimpleGrantedAuthority(role)
        );
    }

    @Override
    public String getPassword() {
        return admin.getMotDePasse();
    }

    @Override
    public String getUsername() {
        return admin.getEmail();
    }

    public Long getId() {
        return admin.getId();
    }

    public Fonction getFonction() {
        return admin.getFonction();
    }

    // Other required UserDetails methods
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}