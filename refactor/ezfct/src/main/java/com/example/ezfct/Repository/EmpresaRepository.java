package com.example.ezfct.Repository;

import com.example.ezfct.Entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    Empresa findByNif(String nif);
    boolean existsByEmailContacto(String email);
    boolean existsByNif(String nif);
}
