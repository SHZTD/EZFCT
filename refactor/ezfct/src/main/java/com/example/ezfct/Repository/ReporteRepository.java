package com.example.ezfct.Repository;

import com.example.ezfct.Entity.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReporteRepository extends JpaRepository<Reporte, Integer> {
    List<Reporte> findByEmail(String email);
    List<Reporte> findByRespuestaIsNull();
}
