package com.example.ezfct.Service;

import com.example.ezfct.Entity.Alumno;
import com.example.ezfct.Entity.Empresa;
import com.example.ezfct.Repository.AlumnoRepository;
import com.example.ezfct.Repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository empresaRepository;

    public Optional<Empresa> findByNif(String nif) {
        return Optional.ofNullable(empresaRepository.findByNif(nif));
    }
}