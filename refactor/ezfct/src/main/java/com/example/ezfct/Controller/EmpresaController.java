package com.example.ezfct.Controller;

import com.example.ezfct.Entity.Empresa;
import com.example.ezfct.Entity.Practicas;
import com.example.ezfct.Repository.EmpresaRepository;
import com.example.ezfct.Security.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresa")
@CrossOrigin("*")
public class EmpresaController {

    @Autowired
    private EmpresaRepository empresaRepository;

    // esto hace una peticion GET
    @GetMapping
    public List<Empresa> getAllEmpresas() {
        return empresaRepository.findAll();
    }

    // POST
    @PostMapping
    public ResponseEntity<?> createEmpresa(@RequestBody Empresa empresa) {
        try {
            if (empresa.getPracticas() != null) {
                for (Practicas p : empresa.getPracticas()) {
                    p.setEmpresa(empresa);
                }
            }

            String epw = AESUtil.encrypt(empresa.getContrasenya());
            empresa.setContrasenya(epw);

            Empresa nuevaEmpresa = empresaRepository.save(empresa);
            return ResponseEntity.ok(nuevaEmpresa);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El email ya está en uso. Por favor, usa otro.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al guardar la empresa.");
        }
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
            // buscar la empresa por ID y cambiar los datos
            Empresa empresaExistente = empresaRepository.findById(id).orElse(null);
            if (empresaExistente == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empresa no encontrada.");
            }

            // actualizar la empresa y ya
            empresaExistente.setNIF(empresaActualizada.getNIF());
            empresaExistente.setDireccion(empresaActualizada.getDireccion());
            empresaExistente.setEmailContacto(empresaActualizada.getEmailContacto());
            empresaExistente.setTelefono(empresaActualizada.getTelefono());
            empresaExistente.setNombre(empresaActualizada.getNombre());

            // vuelve a cifrar siempre la contraseña
            if (
                    empresaActualizada.getContrasenya() != null &&
                    !empresaActualizada.getContrasenya().equals(empresaExistente.getContrasenya())
            ) {
                String epw = AESUtil.encrypt(empresaActualizada.getContrasenya());
                empresaExistente.setContrasenya(epw);
            }

            // por si se tienen que guardas las practicas asociadas
            if (empresaActualizada.getPracticas() != null) {
                for (Practicas practica : empresaActualizada.getPracticas()) {
                    practica.setEmpresa(empresaExistente);
                }
            }

            // guardar la empresa actualizada
            empresaRepository.save(empresaExistente);

            return ResponseEntity.ok(empresaExistente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la empresa.");
        }
    }
}