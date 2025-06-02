package com.example.ezfct.Entity;
import com.example.ezfct.Model.Enums.Modalidad;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Practicas")
public class Practicas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPractica;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    // (unchanged; this is already its own pair with Empresa.practicas)
    @JsonBackReference
    private Empresa empresa;

    private String titulo;
    private String descripcion;
    private String requisitos;
    private java.util.Date fechaInicio;
    private java.util.Date fechaFin;
    private int vacantes;
    private int vecesPostulada;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Modalidad modalidad;

    @OneToMany(mappedBy = "practica", cascade = CascadeType.ALL)
    @JsonManagedReference("practica-diario")
    private List<Diario> diarios;

    @OneToMany(mappedBy = "practica", cascade = CascadeType.ALL)
    private List<Postulacion> postulaciones;

    public int getIdPractica() {
        return idPractica;
    }

    public void setIdPractica(int idPractica) {
        this.idPractica = idPractica;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(String requisitos) {
        this.requisitos = requisitos;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Date getFechaFin() {
        return fechaFin;
    }

    public int getVecesPostulada() {
        return vecesPostulada;
    }

    public void setVecesPostulada(int vecesPostulada) {
        this.vecesPostulada = vecesPostulada;
    }

    public void setFechaFin(Date fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Modalidad getModalidad() {
        return modalidad;
    }

    public void setModalidad(Modalidad modalidad) {
        this.modalidad = modalidad;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public int getVacantes() {
        return vacantes;
    }

    public void setVacantes(int vacantes) {
        this.vacantes = vacantes;
    }

    public List<Postulacion> getPostulaciones() {
        return postulaciones;
    }

    public void setPostulaciones(List<Postulacion> postulaciones) {
        this.postulaciones = postulaciones;
    }

    public List<Diario> getDiarios() {
        return diarios;
    }

    public void setDiarios(List<Diario> diarios) {
        this.diarios = diarios;
    }
}