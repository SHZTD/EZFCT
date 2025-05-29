package com.example.ezfct.Repository;

import com.example.ezfct.Entity.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostulacionRepository extends JpaRepository<Postulacion, Integer> {
    List<Postulacion> findByAlumnoIdAlumno(int idAlumno);
}
