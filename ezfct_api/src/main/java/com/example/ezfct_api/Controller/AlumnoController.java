package com.example.ezfct_api.Controller;

import com.example.ezfct_api.Model.EstadoPractica;
import com.example.ezfct_api.Service.AlumnoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/alumno")
@CrossOrigin("*")
public class AlumnoController {

    private final AlumnoService alumnoService;

    public AlumnoController(AlumnoService alumnoService) {
        this.alumnoService = alumnoService;
    }

    @GetMapping("/insert")
    public ResponseEntity<DtoString> insertAlumno(@RequestParam EstadoPractica estadoPractica) {
        alumnoService.insertAlumno(estadoPractica);
        Date date = new Date();
        System.out.println("Request done at timestamp: " + date);
        return ResponseEntity.ok(new DtoString("Insert correcto."));
    }
}