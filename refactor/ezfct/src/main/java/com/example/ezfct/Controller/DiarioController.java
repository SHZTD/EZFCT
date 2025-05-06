package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Diario;
import com.example.ezfct.Entity.Alumno;
import com.example.ezfct.Entity.Practicas;
import com.example.ezfct.Repository.DiarioRepository;
import com.example.ezfct.Repository.AlumnoRepository;
import com.example.ezfct.Repository.PracticasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diarios")
@CrossOrigin("*")
public class DiarioController {

    @Autowired
    private DiarioRepository diarioRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private PracticasRepository practicasRepository;

    @GetMapping
    public List<Diario> getAllDiarios() {
        return diarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diario> getDiarioById(@PathVariable int id) {
        return diarioRepository.findById(id)
                .map(diario -> ResponseEntity.ok(diario))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/diarios")
    public ResponseEntity<?> getMisDiarios(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(email);
    }

    @PostMapping
    public ResponseEntity<?> createDiario(@RequestBody Diario diario) {
        try {
            Alumno alumno = alumnoRepository.findById(diario.getAlumno().getIdAlumno()).orElse(null);
            Practicas practica = practicasRepository.findById(diario.getPractica().getIdPractica()).orElse(null);

            if (alumno == null || practica == null) {
                return ResponseEntity.badRequest().body("Alumno o practica no encontrados.");
            }

            diario.setAlumno(alumno);
            diario.setPractica(practica);

            Diario nuevoDiario = diarioRepository.save(diario);
            return ResponseEntity.ok(nuevoDiario);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al crear el diario.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiario(@PathVariable int id) {
        try {
            Diario diario = diarioRepository.findById(id).orElse(null);
            if (diario == null) {
                return ResponseEntity.notFound().build();
            }

            diarioRepository.delete(diario);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al eliminar el diario.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDiario(@PathVariable int id, @RequestBody Diario diarioActualizado) {
        try {
            Diario diarioExistente = diarioRepository.findById(id).orElse(null);
            if (diarioExistente == null) {
                return ResponseEntity.notFound().build();
            }

            // Actualizar solo el resumen y la fecha
            diarioExistente.setResumen(diarioActualizado.getResumen());
            diarioExistente.setFecha(diarioActualizado.getFecha());

            diarioRepository.save(diarioExistente);
            return ResponseEntity.ok(diarioExistente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al actualizar el diario.");
        }
    }
}
