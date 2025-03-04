package com.example.ezfct_api.Service;


import com.example.ezfct_api.Model.Alumno;
import com.example.ezfct_api.Model.EstadoPractica;
import com.example.ezfct_api.Repository.AlumnoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class AlumnoService {

    private final AlumnoRepository alumnoRepository;

    public AlumnoService(AlumnoRepository alumnoRepository) {
        this.alumnoRepository = alumnoRepository;
    }

    @Transactional
    public void insertAlumno(EstadoPractica estadoPractica) {
        Alumno alumno = new Alumno(estadoPractica);
        alumnoRepository.save(alumno);
    }
}