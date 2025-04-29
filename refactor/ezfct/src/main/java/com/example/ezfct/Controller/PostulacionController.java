package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Postulacion;
import com.example.ezfct.Entity.Alumno;
import com.example.ezfct.Entity.Practicas;
import com.example.ezfct.Repository.PostulacionRepository;
import com.example.ezfct.Repository.AlumnoRepository;
import com.example.ezfct.Repository.PracticasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/postulaciones")
@CrossOrigin("*")
public class PostulacionController {

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private PracticasRepository practicasRepository;

    @GetMapping
    public List<Postulacion> getAllPostulaciones() {
        return postulacionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Postulacion> getPostulacionById(@PathVariable int id) {
        return postulacionRepository.findById(id)
                .map(postulacion -> ResponseEntity.ok(postulacion))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPostulacion(@RequestBody Postulacion postulacion) {
        try {
            Alumno alumno = alumnoRepository.findById(postulacion.getAlumno().getIdAlumno()).orElse(null);
            Practicas practica = practicasRepository.findById(postulacion.getPractica().getIdPractica()).orElse(null);

            if (alumno == null || practica == null) {
                return ResponseEntity.badRequest().body("Alumno o Práctica no encontrados.");
            }

            postulacion.setAlumno(alumno);
            postulacion.setPractica(practica);

            Postulacion nuevaPostulacion = postulacionRepository.save(postulacion);
            return ResponseEntity.ok(nuevaPostulacion);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al crear la postulación.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePostulacion(@PathVariable int id) {
        try {
            Postulacion postulacion = postulacionRepository.findById(id).orElse(null);
            if (postulacion == null) {
                return ResponseEntity.notFound().build();
            }

            postulacionRepository.delete(postulacion);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al eliminar la postulación.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePostulacion(@PathVariable int id, @RequestBody Postulacion postulacionActualizada) {
        try {
            Postulacion postulacionExistente = postulacionRepository.findById(id).orElse(null);
            if (postulacionExistente == null) {
                return ResponseEntity.notFound().build();
            }

            postulacionExistente.setEstado(postulacionActualizada.getEstado());
            postulacionExistente.setFechaPostulacion(postulacionActualizada.getFechaPostulacion());

            postulacionRepository.save(postulacionExistente);

            return ResponseEntity.ok(postulacionExistente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al actualizar la postulación.");
        }
    }
}