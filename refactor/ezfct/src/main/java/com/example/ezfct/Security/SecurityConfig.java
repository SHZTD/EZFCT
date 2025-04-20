package com.example.ezfct.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // desactivar CSRF para simplificar
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // permitir acceso sin autenticación
                        .requestMatchers("/usuarios/**").permitAll()
                        .requestMatchers("/empresa/**").permitAll()
                        .anyRequest().authenticated() // el resto requiere autenticación
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}