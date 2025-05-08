package com.example.ezfct.DTO;

import com.example.ezfct.Model.Enums.EstadoPostulacion;

import java.util.Date;

public class PracticaDTO {
    private String titulo, descripcion, requisitos, emailContacto, telefono;
    private Date fecha_inicio, fecha_final;
    private EstadoPostulacion estadoPostulacion;
    private int vacantes;

    public PracticaDTO(String titulo, String descripcion, String requisitos, String emailContacto, String telefono, Date fecha_inicio, Date fecha_final, EstadoPostulacion estadoPostulacion, int vacantes) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.requisitos = requisitos;
        this.emailContacto = emailContacto;
        this.telefono = telefono;
        this.fecha_inicio = fecha_inicio;
        this.fecha_final = fecha_final;
        this.estadoPostulacion = estadoPostulacion;
        this.vacantes = vacantes;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
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

    public String getEmailContacto() {
        return emailContacto;
    }

    public void setEmailContacto(String emailContacto) {
        this.emailContacto = emailContacto;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Date getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(Date fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public Date getFecha_final() {
        return fecha_final;
    }

    public void setFecha_final(Date fecha_final) {
        this.fecha_final = fecha_final;
    }

    public EstadoPostulacion getEstadoPostulacion() {
        return estadoPostulacion;
    }

    public void setEstadoPostulacion(EstadoPostulacion estadoPostulacion) {
        this.estadoPostulacion = estadoPostulacion;
    }

    public int getVacantes() {
        return vacantes;
    }

    public void setVacantes(int vacantes) {
        this.vacantes = vacantes;
    }
}