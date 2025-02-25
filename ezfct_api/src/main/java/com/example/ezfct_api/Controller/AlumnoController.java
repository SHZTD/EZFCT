package com.example.ezfct_api.Controller;

import com.example.ezfct_api.Model.EstadoPractica;
import com.example.ezfct_api.Service.AlumnoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/alumno")
@CrossOrigin("*")
public class AlumnoController {

    private final AlumnoService alumnoService;

    public AlumnoController(AlumnoService alumnoService) {
        this.alumnoService = alumnoService;
    }

    @GetMapping("/insert")
    public String insertAlumno(@RequestParam Long uid, @RequestParam EstadoPractica estadoPractica) {
        alumnoService.insertAlumno(uid, estadoPractica);
        return "Alumno insertado con UID: " + uid + ".\nEstado practica: " + estadoPractica;
    }
}