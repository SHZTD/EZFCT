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
@RequestMapping("/api/postulaciones")
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
                return ResponseEntity.badRequest().body("Alumno o practica no encontrados.");
            }

            postulacion.setAlumno(alumno);
            postulacion.setPractica(practica);

            Postulacion nuevaPostulacion = postulacionRepository.save(postulacion);

            practica.setVecesPostulada(practica.getVecesPostulada() + 1);
            practicasRepository.save(practica);

            return ResponseEntity.ok(nuevaPostulacion);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al crear la postulacion.");
        }
    }

    // no se comprueba duplicidad :skull:
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePostulacion(@PathVariable int id) {
        try {
            Postulacion postulacion = postulacionRepository.findById(id).orElse(null);
            if (postulacion == null) {
                return ResponseEntity.notFound().build();
            }

            Practicas practica = postulacion.getPractica();
            postulacionRepository.delete(postulacion);

            // intenta restar el contador
            practica.setVecesPostulada(Math.max(0, practica.getVecesPostulada() - 1));
            practicasRepository.save(practica);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al eliminar la postulacion.");
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
            return ResponseEntity.internalServerError().body("Error al actualizar la postulacion.");
        }
    }

    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<?> getPostulacionesByAlumnoId(@PathVariable int idAlumno) {
        try {
            // Verify the student exists
            if (!alumnoRepository.existsById(idAlumno)) {
                return ResponseEntity.notFound().build();
            }

            // Get all postulations for the student
            List<Postulacion> postulaciones = postulacionRepository.findByAlumnoIdAlumno(idAlumno);

            // You might want to return a simplified DTO instead of the full entity
            return ResponseEntity.ok(postulaciones);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error al obtener las postulaciones del alumno");
        }
    }
}