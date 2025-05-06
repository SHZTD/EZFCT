package com.example.ezfct.Controller;

import com.example.ezfct.DTO.UsuarioDTO;
import com.example.ezfct.Entity.Usuario;
import com.example.ezfct.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(u -> new UsuarioDTO(u.getNombre(), u.getApellido(), u.getEmail()))
                .toList();

        return ResponseEntity.ok(usuariosDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUsuario(@PathVariable int id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario u = usuarioOpt.get();
        UsuarioDTO dto = new UsuarioDTO(u.getNombre(), u.getApellido(), u.getEmail());
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        try {
            String epw = passwordEncoder.encode(usuario.getPassword());
            usuario.setPassword(epw);
            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            // construimos el DTO
            UsuarioDTO dto = new UsuarioDTO(
                    nuevoUsuario.getNombre(),
                    nuevoUsuario.getApellido(),
                    nuevoUsuario.getEmail()
            );

            // devolvemos solo el dto, nada de passwords y eso
            return ResponseEntity.ok(dto);

            // requiere fix ahora
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El email ya está en uso. Por favor, usa otro.");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}