package com.example.ezfct.Repository;

import com.example.ezfct.Entity.Empresa;
import com.example.ezfct.Entity.Practicas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticasRepository extends JpaRepository<Practicas, Integer> {
    List<Practicas> findByEmpresa(Empresa empresa);
}
