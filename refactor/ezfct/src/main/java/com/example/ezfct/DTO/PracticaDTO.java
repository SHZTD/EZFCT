package com.example.ezfct.DTO;

import com.example.ezfct.Model.Enums.EstadoPostulacion;
import java.util.Date;

public class PracticaDTO {
    private int idPractica;
    private int idEmpresa;
    private String titulo;
    private String descripcion;
    private String requisitos;
    private Date fechaInicio;
    private Date fechaFin;
    private int vacantes;
    private String modalidad;
    private String emailContacto;
    private String telefono;

    public PracticaDTO(
            int idPractica,
            int idEmpresa,
            String titulo,
            String descripcion,
            String requisitos,
            Date fechaInicio,
            Date fechaFin,
            int vacantes,
            String modalidad,
            String emailContacto,
            String telefono
    ) {
        this.idPractica = idPractica;
        this.idEmpresa = idEmpresa;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.requisitos = requisitos;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.vacantes = vacantes;
        this.modalidad = modalidad;
        this.emailContacto = emailContacto;
        this.telefono = telefono;
    }

    // Getters y setters de todos los campos (o bien solo getters, si no vas a modificar desde JSON)
    public int getIdPractica() { return idPractica; }
    public void setIdPractica(int idPractica) { this.idPractica = idPractica; }

    public int getIdEmpresa() { return idEmpresa; }
    public void setIdEmpresa(int idEmpresa) { this.idEmpresa = idEmpresa; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getRequisitos() { return requisitos; }
    public void setRequisitos(String requisitos) { this.requisitos = requisitos; }

    public Date getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(Date fechaInicio) { this.fechaInicio = fechaInicio; }

    public Date getFechaFin() { return fechaFin; }
    public void setFechaFin(Date fechaFin) { this.fechaFin = fechaFin; }

    public int getVacantes() { return vacantes; }
    public void setVacantes(int vacantes) { this.vacantes = vacantes; }

    public String getModalidad() { return modalidad; }
    public void setModalidad(String modalidad) { this.modalidad = modalidad; }

    public String getEmailContacto() { return emailContacto; }
    public void setEmailContacto(String emailContacto) { this.emailContacto = emailContacto; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}