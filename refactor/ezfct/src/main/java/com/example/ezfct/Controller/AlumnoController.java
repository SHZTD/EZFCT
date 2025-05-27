package com.example.ezfct.Controller;

import com.example.ezfct.DTO.EstadoDTO;
import com.example.ezfct.Entity.Alumno;
import com.example.ezfct.Entity.Practicas;
import com.example.ezfct.Entity.Usuario;
import com.example.ezfct.Model.Enums.EstadoPractica;
import com.example.ezfct.Repository.AlumnoRepository;
import com.example.ezfct.Repository.PracticasRepository;
import com.example.ezfct.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin("*")
public class AlumnoController {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PracticasRepository practicasRepository;


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
            alumno.setCompetencias(actualizado.getCompetencias());
            alumno.setDisponibilidad(actualizado.getDisponibilidad());
            alumno.setPortfolio(actualizado.getPortfolio());
            alumnoRepository.save(alumno);
            return ResponseEntity.ok(alumno);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> updateEstadoPractica(@PathVariable int id, @RequestBody EstadoDTO estadoDTO) {
        return alumnoRepository.findById(id).map(alumno -> {
            alumno.setEstadoPractica(estadoDTO.getEstadoPractica());
            alumnoRepository.save(alumno);
            return ResponseEntity.ok("Estado actualizado a: " + estadoDTO.getEstadoPractica());
        }).orElse(ResponseEntity.notFound().build());
    }

    // match para el alumno

    @GetMapping("/{idAlumno}/match/practica/{idPractica}")
    public ResponseEntity<?> calcularMatch(
            @PathVariable int idAlumno,
            @PathVariable int idPractica
    ) {
        Optional<Alumno> alumnoOpt = alumnoRepository.findById(idAlumno);
        Optional<Practicas> practicaOpt = practicasRepository.findById(idPractica);

        if (alumnoOpt.isEmpty() || practicaOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Alumno o practica no encontrados.");
        }

        Alumno alumno = alumnoOpt.get();
        Practicas practica = practicaOpt.get();

        if (alumno.getCompetencias() == null || practica.getRequisitos() == null) {
            return ResponseEntity.badRequest().body("Faltan competencias o requisitos.");
        }

        Set<String> competencias = Arrays.stream(alumno.getCompetencias().split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        Set<String> requisitos = Arrays.stream(practica.getRequisitos().split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        long coincidencias = requisitos.stream()
                .filter(competencias::contains)
                .count();

        int total = requisitos.size();
        int porcentaje = total == 0 ? 0 : (int) ((coincidencias * 100.0) / total);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("matchPercentage", porcentaje);
        resultado.put("coincidencias", coincidencias);
        resultado.put("totalRequisitos", total);

        return ResponseEntity.ok(resultado);
    }
}