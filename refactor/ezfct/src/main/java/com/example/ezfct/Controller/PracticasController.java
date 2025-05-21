package com.example.ezfct.Controller;

import com.example.ezfct.DTO.PracticaDTO;
import com.example.ezfct.Entity.Practicas;
import com.example.ezfct.Entity.Empresa;
import com.example.ezfct.Repository.PracticasRepository;
import com.example.ezfct.Repository.EmpresaRepository;
import com.example.ezfct.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/practicas")
@CrossOrigin("*")
public class PracticasController {

    @Autowired
    private PracticasRepository practicasRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @GetMapping
    public List<Practicas> getAllPracticas() {
        return practicasRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Practicas> getPracticaById(@PathVariable int id) {
        return practicasRepository.findById(id)
                .map(practica -> ResponseEntity.ok(practica))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estimado/{id}")
    public ResponseEntity<Long> doEstimado(@PathVariable int id) {
        // obtener la practica por el id de la base de datos
        Optional<Practicas> practicaOpt = practicasRepository.findById(id);

        if (practicaOpt.isPresent()) {
            Practicas practica = practicaOpt.get();

            // estimacion en dias
            Date fechaInicio = practica.getFechaInicio();
            Date fechaFin = practica.getFechaFin();

            if (fechaInicio != null && fechaFin != null) {
                long durationInMillis = fechaFin.getTime() - fechaInicio.getTime();
                long durationInDays = durationInMillis / (1000 * 60 * 60 * 24); // to ms

                return ResponseEntity.ok(durationInDays); // a dias
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createPractica(
            @RequestBody Practicas practica,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            // Eliminar el prefijo "Bearer "
            String token = authHeader.replace("Bearer ", "");
            System.out.println("TOKEN:" + token);
            // Extraer datos del token
            Long idEmpresa = jwtUtil.extractId(token);
            String rol = jwtUtil.extractRol(token);

            // Validar que el rol sea EMPRESA
            if (!rol.equals("EMPRESA")) {
                return ResponseEntity.status(403).body("Solo empresas pueden publicar prácticas.");
            }

            Empresa empresa = empresaRepository.findByidEmpresa(idEmpresa);
            if (empresa == null) {
                return ResponseEntity.badRequest().body("No se encontró la empresa asociada al usuario.");
            }

            // Asignar empresa y guardar
            practica.setEmpresa(empresa);
            Practicas nuevaPractica = practicasRepository.save(practica);

            return ResponseEntity.ok(nuevaPractica);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al crear la práctica.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePractica(@PathVariable int id, @RequestBody Practicas practicaActualizada) {
        try {
            // null puajajaja, optionals no
            Practicas practicaExistente = practicasRepository.findById(id).orElse(null);
            if (practicaExistente == null) {
                return ResponseEntity.notFound().build();
            }

            practicaExistente.setTitulo(practicaActualizada.getTitulo());
            practicaExistente.setDescripcion(practicaActualizada.getDescripcion());


            practicaExistente.setRequisitos(practicaActualizada.getRequisitos());
            practicaExistente.setFechaInicio(practicaActualizada.getFechaInicio());
            practicaExistente.setFechaFin(practicaActualizada.getFechaFin());
            practicaExistente.setVacantes(practicaActualizada.getVacantes());
            practicaExistente.setModalidad(practicaActualizada.getModalidad());

            practicasRepository.save(practicaExistente);
            return ResponseEntity.ok(practicaExistente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al actualizar la práctica.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePractica(@PathVariable int id) {
        try {
            Practicas practica = practicasRepository.findById(id).orElse(null);
            if (practica == null) {
                return ResponseEntity.notFound().build();
            }

            practicasRepository.delete(practica);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al eliminar la práctica.");
        }
    }
}