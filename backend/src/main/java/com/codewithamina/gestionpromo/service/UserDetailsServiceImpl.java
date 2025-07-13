package com.codewithamina.gestionpromo.service;

import com.codewithamina.gestionpromo.config.AdminDetails;
import com.codewithamina.gestionpromo.model.Admin;
import com.codewithamina.gestionpromo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin non trouvé avec l'email : " + email));
        // Debug information
        System.out.println("=== DEBUG INFO ===");
        System.out.println("Found admin: " + admin.getEmail());
        System.out.println("Password hash from DB: " + admin.getMotDePasse());
        System.out.println("Hash length: " + admin.getMotDePasse().length());
        System.out.println("Hash starts with $2a$: " + admin.getMotDePasse().startsWith("$2a$"));
        System.out.println("==================");

        return new AdminDetails(admin);

    }

}
