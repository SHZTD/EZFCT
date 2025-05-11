package com.example.ezfct.Repository;

import com.example.ezfct.Entity.Empresa;
import com.example.ezfct.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    Empresa findByNif(String nif);
    Optional<Empresa> findByEmailContacto(String email);
    boolean existsByEmailContacto(String email);
    boolean existsByNif(String nif);
}
