package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Alumno;
import com.example.ezfct.Entity.Usuario;
import com.example.ezfct.Model.Enums.EstadoPractica;
import com.example.ezfct.Repository.AlumnoRepository;
import com.example.ezfct.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin("*")
public class AlumnoController {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Alumno> getAllAlumnos() {
        return alumnoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAlumnoById(@PathVariable int id) {
        return alumnoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAlumno(@RequestBody Alumno alumno) {
        try {
            Usuario usuario = usuarioRepository.findById(alumno.getUsuario().getIdUsuario()).orElse(null);
            if (usuario == null) {
                return ResponseEntity.badRequest().body("Usuario no encontrado.");
            }

            alumno.setUsuario(usuario);
            Alumno nuevoAlumno = alumnoRepository.save(alumno);
            return ResponseEntity.ok(nuevoAlumno);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al crear el alumno.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAlumno(@PathVariable int id, @RequestBody Alumno actualizado) {
        return alumnoRepository.findById(id).map(alumno -> {
            alumno.setBiografia(actualizado.getBiografia());
            alumno.setHabilidades(actualizado.getHabilidades());
            alumno.setEducacion(actualizado.getEducacion());
            alumno.setExperiencia(actualizado.getExperiencia());
            alumno.setDisponibilidad(actualizado.getDisponibilidad());
            alumno.setPortfolio(actualizado.getPortfolio());
            alumnoRepository.save(alumno);
            return ResponseEntity.ok(alumno);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> updateEstadoPractica(@PathVariable int id, @RequestBody EstadoPractica nuevoEstado) {
        return alumnoRepository.findById(id).map(alumno -> {
            alumno.setEstadoPractica(nuevoEstado);
            alumnoRepository.save(alumno);
            return ResponseEntity.ok("Estado actualizado a: " + nuevoEstado);
        }).orElse(ResponseEntity.notFound().build());
    }
}
