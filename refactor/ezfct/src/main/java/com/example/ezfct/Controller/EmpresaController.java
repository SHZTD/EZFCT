package com.example.ezfct.Controller;

import com.example.ezfct.DTO.EmpresaDTO;
import com.example.ezfct.Entity.Empresa;
import com.example.ezfct.Entity.Practicas;
import com.example.ezfct.Repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresa")
@CrossOrigin("*")
public class EmpresaController {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // esto hace una peticion GET
    @GetMapping
    public ResponseEntity<List<EmpresaDTO>> getAllEmpresas() {
        List<Empresa> empresas = empresaRepository.findAll();

        List<EmpresaDTO> empresasDTO = empresas.stream()
                .map(e -> new EmpresaDTO(
                        e.getNIF(),
                        e.getNombre(),
                        e.getDireccion(),
                        e.getEmailContacto(),
                        e.getTelefono()
                ))
                .toList();

        return ResponseEntity.ok(empresasDTO);
    }

    // eliminar la empresa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmpresa(@PathVariable int id) {
        try {
            // la empresa existe?
            Empresa empresa = empresaRepository.findById(id).orElse(null);
            if (empresa == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Empresa no encontrada.");
            }

            empresaRepository.delete(empresa);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Empresa eliminada correctamente.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la empresa.");
        }
    }

    // update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmpresa(@PathVariable int id, @RequestBody Empresa empresaActualizada) {
        try {
            Empresa empresaExistente = empresaRepository.findById(id).orElse(null);
            if (empresaExistente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empresa no encontrada.");
            }

            empresaExistente.setNIF(empresaActualizada.getNIF());
            empresaExistente.setDireccion(empresaActualizada.getDireccion());
            empresaExistente.setEmailContacto(empresaActualizada.getEmailContacto());
            empresaExistente.setTelefono(empresaActualizada.getTelefono());
            empresaExistente.setNombre(empresaActualizada.getNombre());

            if (
                    empresaActualizada.getPassword() != null &&
                            !empresaActualizada.getPassword().equals(empresaExistente.getPassword())
            ) {
                String epw = passwordEncoder.encode(empresaActualizada.getPassword());
                empresaExistente.setContrasenya(epw);
            }

            if (empresaActualizada.getPracticas() != null) {
                for (Practicas practica : empresaActualizada.getPracticas()) {
                    practica.setEmpresa(empresaExistente);
                }
            }

            Empresa actualizada = empresaRepository.save(empresaExistente);

            EmpresaDTO dto = new EmpresaDTO(
                    actualizada.getNIF(),
                    actualizada.getNombre(),
                    actualizada.getDireccion(),
                    actualizada.getEmailContacto(),
                    actualizada.getTelefono()
            );

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la empresa.");
        }
    }

    // ns si esta bien de por si
    @PatchMapping("/{id}")
    public ResponseEntity<?> patchEmpresa(@PathVariable int id, @RequestBody Empresa cambiosParciales) {
        try {
            Empresa empresaExistente = empresaRepository.findById(id).orElse(null);
            if (empresaExistente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empresa no encontrada.");
            }

            // solo actualizamos aquellos que no son nulos
            if (cambiosParciales.getNIF() != null)
                empresaExistente.setNIF(cambiosParciales.getNIF());

            if (cambiosParciales.getDireccion() != null)
                empresaExistente.setDireccion(cambiosParciales.getDireccion());

            if (cambiosParciales.getEmailContacto() != null)
                empresaExistente.setEmailContacto(cambiosParciales.getEmailContacto());

            if (cambiosParciales.getTelefono() != null)
                empresaExistente.setTelefono(cambiosParciales.getTelefono());

            if (cambiosParciales.getNombre() != null)
                empresaExistente.setNombre(cambiosParciales.getNombre());

            if (cambiosParciales.getPassword() != null) {
                String epw = passwordEncoder.encode(cambiosParciales.getPassword());
                empresaExistente.setContrasenya(epw);
            }

            Empresa actualizada = empresaRepository.save(empresaExistente);

            EmpresaDTO dto = new EmpresaDTO(
                    actualizada.getNIF(),
                    actualizada.getNombre(),
                    actualizada.getDireccion(),
                    actualizada.getEmailContacto(),
                    actualizada.getTelefono()
            );

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al aplicar cambios a la empresa.");
        }
    }
}