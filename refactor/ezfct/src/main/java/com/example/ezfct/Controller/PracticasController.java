package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Practicas;
import com.example.ezfct.Entity.Empresa;
import com.example.ezfct.Repository.PracticasRepository;
import com.example.ezfct.Repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/practicas")
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

    @PostMapping
    public ResponseEntity<?> createPractica(@RequestBody Practicas practica) {
        try {
            Empresa empresa = empresaRepository.findById(practica.getEmpresa().getIdEmpresa()).orElse(null);

            if (empresa == null) {
                return ResponseEntity.badRequest().body("Empresa no encontrada para esta práctica.");
            }

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
            Practicas practicaExistente = practicasRepository.findById(id).orElse(null);
            if (practicaExistente == null) {
                return ResponseEntity.notFound().build();
            }

            practicaExistente.setDescripcion(practicaActualizada.getDescripcion());
            practicaExistente.setRequisitos(practicaActualizada.getRequisitos());
            practicaExistente.setFechaInicio(practicaActualizada.getFechaInicio());
            practicaExistente.setFechaFin(practicaActualizada.getFechaFin());
            practicaExistente.setSalario(practicaActualizada.getSalario());
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
