package com.example.ezfct.Repository;

import com.example.ezfct.Entity.Diario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiarioRepository extends JpaRepository<Diario, Integer> {
    List<Diario> findByAlumnoIdAlumno(int idAlumno);
    List<Diario> findByAlumnoUsuarioEmail(String email);
}
