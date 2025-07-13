package com.codewithamina.gestionpromo.config;

import com.codewithamina.gestionpromo.model.Admin;
import org.springframework.security.core.GrantedAuthority;
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
        // Aucun rôle attribué pour le moment, on retourne une liste vide
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return admin.getMotDePasse();
    }

    @Override
    public String getUsername() {
        return admin.getEmail(); // Email utilisé comme identifiant de connexion
    }

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

    public Admin getAdmin() {
        return admin;
    }
}
