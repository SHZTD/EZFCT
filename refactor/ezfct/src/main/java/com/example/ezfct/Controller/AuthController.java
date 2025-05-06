package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Usuario;
import com.example.ezfct.Model.Enums.Rol;
import com.example.ezfct.Repository.UsuarioRepository;
import com.example.ezfct.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    String localHostUrl = "http://localhost:8080";
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            String token = jwtUtil.generateToken(usuario.getEmail()); // generar token
            return ResponseEntity.ok().body(new LoginResponse(
                    token.toString()
            ));
        } else {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }
    }

    // clases internas para request/response
    static class LoginRequest {
        private String email;
        private String password;
        // getters y Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // internal dto LoginResponse
    static class LoginResponse {
        private String token; // token ahora

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() { return token; }
    }
}