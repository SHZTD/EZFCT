package com.example.ezfct.Controller;

import com.example.ezfct.DTO.PostulacionDTO;
import com.example.ezfct.DTO.PracticaDTO;
import com.example.ezfct.Entity.*;
import com.example.ezfct.Model.Enums.EstadoPostulacion;
import com.example.ezfct.Repository.PostulacionRepository;
import com.example.ezfct.Repository.PracticasRepository;
import com.example.ezfct.Repository.EmpresaRepository;
import com.example.ezfct.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/practicas")
@CrossOrigin("*")
public class PracticasController {

    @Autowired
    private PracticasRepository practicasRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @GetMapping
    public List<Practicas> getAllPracticas() {
        return practicasRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PracticaDTO> getPracticaById(@PathVariable int id) {
        return practicasRepository.findById(id)
                .map(practica -> {
                    Empresa e = practica.getEmpresa();

                    int idEmpresa = e.getIdEmpresa();
                    String emailContacto = e.getEmailContacto();
                    String telefono = e.getTelefono();

                    PracticaDTO dto = new PracticaDTO(
                            practica.getIdPractica(),
                            idEmpresa,
                            practica.getTitulo(),
                            practica.getDescripcion(),
                            practica.getRequisitos(),
                            practica.getFechaInicio(),
                            practica.getFechaFin(),
                            practica.getVacantes(),
                            practica.getModalidad().name(),  // si tu Modalidad es un enum
                            emailContacto,
                            telefono
                    );

                    return ResponseEntity.ok(dto);
                })
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

    @GetMapping("/empresa")
    public ResponseEntity<?> getPracticasByEmpresa(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long idEmpresa = jwtUtil.extractId(token);
            String rol = jwtUtil.extractRol(token);

            if (!rol.equals("EMPRESA")) {
                return ResponseEntity.status(403).body("Solo empresas pueden ver sus prácticas.");
            }

            Empresa empresa = empresaRepository.findByidEmpresa(idEmpresa);
            if (empresa == null) {
                return ResponseEntity.badRequest().body("No se encontró la empresa asociada.");
            }

            List<Practicas> practicas = practicasRepository.findByEmpresa(empresa);
            return ResponseEntity.ok(practicas);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al obtener las prácticas.");
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

    @GetMapping("/{idPractica}/postulaciones")
    public ResponseEntity<?> getPostulacionesByPractica(@PathVariable int idPractica) {
        try {
            Optional<Practicas> practica = practicasRepository.findById(idPractica);

            List<Postulacion> postulaciones = postulacionRepository.findByPractica(practica.orElse(null));

            List<PostulacionDTO> response = postulaciones.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching applications");
        }
    }

    private PostulacionDTO convertToDto(Postulacion postulacion) {
        Alumno alumno = postulacion.getAlumno();
        Usuario usuario = alumno != null ? alumno.getUsuario() : null;
        Practicas practica = postulacion.getPractica();

        return new PostulacionDTO(
                postulacion.getIdPostulacion(),
                postulacion.getEstado().toString(),
                postulacion.getFechaPostulacion(),
                usuario != null ? usuario.getNombre() : "Unknown",
                usuario != null ? usuario.getApellido() : "Student",
                usuario != null ? usuario.getEmail() : "",
                alumno != null ? alumno.getBiografia() : "",
                alumno != null ? alumno.getHabilidades() : "",
                alumno != null ? alumno.getEducacion() : "",
                practica != null ? practica.getTitulo() : "Unknown Offer"
        );
    }

    @PostMapping("/postulaciones/{idPostulacion}/accept")
    public ResponseEntity<?> acceptPostulacion(@PathVariable int idPostulacion) {
        try {
            Postulacion postulacion = postulacionRepository.findById(idPostulacion).orElse(null);
            if (postulacion == null) {
                return ResponseEntity.notFound().build();
            }

            postulacion.setEstado(EstadoPostulacion.ACEPTADA);
            postulacionRepository.save(postulacion);

            return ResponseEntity.ok("Application accepted");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error accepting application");
        }
    }

    @PostMapping("/postulaciones/{idPostulacion}/reject")
    public ResponseEntity<?> rejectPostulacion(@PathVariable int idPostulacion) {
        try {
            Postulacion postulacion = postulacionRepository.findById(idPostulacion).orElse(null);
            if (postulacion == null) {
                return ResponseEntity.notFound().build();
            }

            postulacion.setEstado(EstadoPostulacion.RECHAZADA);
            postulacionRepository.save(postulacion);

            return ResponseEntity.ok("Application rejected");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error rejecting application");
        }
    }

    @GetMapping("/postulaciones/alumno/{idAlumno}")
    public ResponseEntity<?> getPostulacionesByAlumnoId(@PathVariable int idAlumno) {
        try {
            List<Postulacion> postulaciones = postulacionRepository.findByAlumnoIdAlumno(idAlumno);

            Optional<Postulacion> activePostulacion = postulaciones.stream()
                    .filter(p -> p.getEstado() == EstadoPostulacion.PENDIENTE)
                    .findFirst();

            if (activePostulacion.isPresent()) {
                return ResponseEntity.ok(activePostulacion.get().getIdPostulacion());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching student applications");
        }
    }
}