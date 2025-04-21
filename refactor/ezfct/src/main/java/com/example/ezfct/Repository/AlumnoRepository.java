package com.example.ezfct.Repository;

import com.example.ezfct.Entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {
    Alumno findByUsuarioId(int usuarioId);
}