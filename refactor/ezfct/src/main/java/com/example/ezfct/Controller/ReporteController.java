package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Reporte;
import com.example.ezfct.Model.Enums.Rol;
import com.example.ezfct.Repository.ReporteRepository;
import com.example.ezfct.Security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reporte")
@CrossOrigin("*")
public class ReporteController {

    @Autowired
    private ReporteRepository reporteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Profesor crea reporte
    @PostMapping("/profesor")
    public ResponseEntity<?> crearReporte(HttpServletRequest request, @RequestBody Map<String, String> body) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);
        Rol rol = Rol.valueOf(jwtUtil.extractRol(token));

        if (!rol.equals(Rol.PROFESOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los profesores pueden enviar reportes.");
        }

        Reporte reporte = new Reporte();
        reporte.setEmail(email);
        reporte.setRol(rol);
        reporte.setMensaje(body.get("mensaje"));
        reporte.setRespuesta(null);

        return ResponseEntity.ok(reporteRepository.save(reporte));
    }

    // Admin responde
    @PostMapping("/admin")
    public ResponseEntity<?> responderReporte(HttpServletRequest request, @RequestBody Map<String, String> body) {
        String token = request.getHeader("Authorization").substring(7);
        Rol rol = Rol.valueOf(jwtUtil.extractRol(token));

        if (!rol.equals(Rol.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo el administrador puede responder reportes.");
        }

        int idReporte = Integer.parseInt(body.get("idReporte"));
        Optional<Reporte> optional = reporteRepository.findById(idReporte);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reporte no encontrado.");
        }

        Reporte reporte = optional.get();
        reporte.setRespuesta(body.get("respuesta"));

        return ResponseEntity.ok(reporteRepository.save(reporte));
    }

    // Profesor ve sus propios reportes (con respuestas si existen)
    @GetMapping("/profesor")
    public ResponseEntity<?> verReportesProfesor(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);
        Rol rol = Rol.valueOf(jwtUtil.extractRol(token));

        if (!rol.equals(Rol.PROFESOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los profesores pueden ver sus reportes.");
        }

        List<Reporte> reportes = reporteRepository.findByEmail(email);
        return ResponseEntity.ok(reportes);
    }

    // Admin ve todos los reportes sin respuesta
    @GetMapping("/admin")
    public ResponseEntity<?> verReportesSinResponder(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        Rol rol = Rol.valueOf(jwtUtil.extractRol(token));

        if (!rol.equals(Rol.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo el administrador puede ver todos los reportes.");
        }

        List<Reporte> reportes = reporteRepository.findByRespuestaIsNull();
        return ResponseEntity.ok(reportes);
    }
}
