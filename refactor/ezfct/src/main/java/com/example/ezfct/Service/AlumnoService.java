package com.example.ezfct.Service;

import com.example.ezfct.Entity.Alumno;
import com.example.ezfct.Repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    public Optional<Alumno> getAlumnoById(int id) {
        return alumnoRepository.findById(id);
    }

    public Optional<Alumno> findByUsuarioId(int usuarioId) {
        return Optional.ofNullable(alumnoRepository.findByUsuarioId(usuarioId));
    }
}