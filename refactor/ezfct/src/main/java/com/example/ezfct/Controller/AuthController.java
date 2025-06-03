package com.example.ezfct.Controller;

import com.example.ezfct.DTO.EmpresaDTO;
import com.example.ezfct.DTO.LoginRequest;
import com.example.ezfct.DTO.UsuarioDTO;
import com.example.ezfct.Entity.*;
import com.example.ezfct.Model.Enums.Rol;
import com.example.ezfct.Repository.AlumnoRepository;
import com.example.ezfct.Repository.EmpresaRepository;
import com.example.ezfct.Repository.ProfesorRepository;
import com.example.ezfct.Repository.UsuarioRepository;
import com.example.ezfct.Security.JwtUtil;
import com.example.ezfct.Model.Enums.EstadoPractica;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // usuario
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/userlogin")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            String token = jwtUtil.generateToken((long)usuario.getIdUsuario(), usuario.getEmail(), usuario.getRol());
            return ResponseEntity.ok().body(new LoginResponse(token));
        } else {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }
    }

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private ProfesorRepository profesorRepository;


    @PostMapping("/registeruser")
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        try {
            // Comprobación básica
            if (usuario.getRol() == null) {
                return ResponseEntity.badRequest().body("El rol es obligatorio.");
            }

            String epw = passwordEncoder.encode(usuario.getPassword());
            usuario.setPassword(epw);

            Usuario nuevoUsuario = usuarioRepository.save(usuario);

            // Según el rol, insertar también en Profesor o Alumno
            if (usuario.getRol().equals(Rol.ALUMNO)) {
                Alumno alumno = new Alumno();
                alumno.setUsuario(nuevoUsuario);
                alumno.setEstadoPractica(EstadoPractica.PENDIENTE);
                alumnoRepository.save(alumno);
            } else if (usuario.getRol().equals(Rol.PROFESOR)) {
                Profesor profesor = new Profesor();
                profesor.setUsuario(nuevoUsuario);
                profesorRepository.save(profesor);
            }

            // Devolver DTO limpio
            UsuarioDTO dto = new UsuarioDTO(
                    nuevoUsuario.getNombre(),
                    nuevoUsuario.getApellido(),
                    nuevoUsuario.getEmail(),
                    nuevoUsuario.getRol()
            );

            return ResponseEntity.ok(dto);

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El email ya está en uso. Por favor, usa otro.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar usuario.");
        }
    }

    // empresa
    @Autowired
    private EmpresaRepository empresaRepository;

    @PostMapping("/registerempresa")
    public ResponseEntity<?> createEmpresa(@RequestBody Empresa empresa) {
        try {
            boolean emailExists = empresaRepository.existsByEmailContacto(empresa.getEmailContacto());
            if (emailExists) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El email ya esta en uso. Por favor, usa otro.");
            }

            boolean nifExists = empresaRepository.existsByNif(empresa.getNIF());
            if (nifExists) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El NIF ya esta registrado. Por favor, usa otro.");
            }

            if (empresa.getPracticas() != null) {
                for (Practicas p : empresa.getPracticas()) {
                    p.setEmpresa(empresa);
                }
            }

            String epw = passwordEncoder.encode(empresa.getPassword());
            empresa.setContrasenya(epw);

            Empresa nuevaEmpresa = empresaRepository.save(empresa);

            EmpresaDTO dto = new EmpresaDTO(
                    nuevaEmpresa.getNIF(),
                    nuevaEmpresa.getNombre(),
                    nuevaEmpresa.getDireccion(),
                    nuevaEmpresa.getEmailContacto(),
                    nuevaEmpresa.getTelefono()
            );

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al guardar la empresa.");
        }
    }

    @PostMapping("/empresalogin")
    public ResponseEntity<?> loginEmpresa(@RequestBody LoginRequest loginRequest) {
        Optional<Empresa> empresaOpt = empresaRepository.findByEmailContacto(loginRequest.getEmail());

        if (empresaOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Empresa no encontrado");
        }

        Empresa empresa = empresaOpt.get();

        if (passwordEncoder.matches(loginRequest.getPassword(), empresa.getPassword())) {
            String token = jwtUtil.generateToken((long)empresa.getIdEmpresa(), empresa.getEmailContacto(), Rol.EMPRESA);
            return ResponseEntity.ok().body(new LoginResponse(token));
        } else {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }
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