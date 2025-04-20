package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Usuario;
import com.example.ezfct.Model.Enums.Rol;
import com.example.ezfct.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            // Determinar la URL de redirección basada en el rol
            String redirectUrl = determinarUrl(usuario.getRol());
            return ResponseEntity.ok().body(new LoginResponse(
                    usuario.getRol().toString(),
                    redirectUrl
            ));
        } else {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }
    }

    // Clases internas para request/response
    static class LoginRequest {
        private String email;
        private String password;
        // Getters y Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    private String determinarUrl(Rol rol) {
        switch (rol) {
            case ALUMNO:
                return "http://192.168.1.139:8080/alumno/alumno.html";
            case PROFESOR:
                return "http://192.168.1.139:8080/profe/profe.html";
            case ADMIN:
                return "http://192.168.1.139:8080/admin/admin.html";
            default:
                return "http://192.168.1.139:8080/error.html";
        }
    }

    static class LoginResponse {
        private String rol;
        private String redirectUrl;

        public LoginResponse(String rol, String redirectUrl) {
            this.rol = rol;
            this.redirectUrl = redirectUrl;
        }
        // Getters
        public String getRol() { return rol; }
        public String getRedirectUrl() { return redirectUrl; }
    }
}