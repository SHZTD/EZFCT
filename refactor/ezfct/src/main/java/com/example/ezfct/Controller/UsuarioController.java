package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Usuario;
import com.example.ezfct.Repository.UsuarioRepository;
import com.example.ezfct.Security.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // esto hace una peticion GET
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Usuario> getUsuario(@PathVariable int id) {
        return usuarioRepository.findById(id);
    }

    // esto hace una peticion POST
    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        try {
            String epw = AESUtil.encrypt(usuario.getPassword());
            usuario.setPassword(epw);
            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El email ya está en uso. Por favor, usa otro.");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}