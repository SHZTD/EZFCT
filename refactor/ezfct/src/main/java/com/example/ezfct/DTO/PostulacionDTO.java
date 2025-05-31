package com.example.ezfct.DTO;

import java.util.Date;

public class PostulacionDTO {
    private int idPostulacion;
    private String estado;
    private Date fechaPostulacion;

    // Alumno->Usuario
    private String nombre;
    private String apellido;  // Singular to match Usuario entity
    private String email;

    // Alumno
    private String biografia;
    private String habilidades;
    private String educacion;

    // Practica
    private String tituloPractica;

    public PostulacionDTO(int idPostulacion, String estado, Date fechaPostulacion, String nombre, String apellido, String email, String biografia, String habilidades, String educacion, String tituloPractica) {
        this.idPostulacion = idPostulacion;
        this.estado = estado;
        this.fechaPostulacion = fechaPostulacion;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.biografia = biografia;
        this.habilidades = habilidades;
        this.educacion = educacion;
        this.tituloPractica = tituloPractica;
    }

    public int getIdPostulacion() {
        return idPostulacion;
    }

    public void setIdPostulacion(int idPostulacion) {
        this.idPostulacion = idPostulacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Date getFechaPostulacion() {
        return fechaPostulacion;
    }

    public void setFechaPostulacion(Date fechaPostulacion) {
        this.fechaPostulacion = fechaPostulacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public String getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(String habilidades) {
        this.habilidades = habilidades;
    }

    public String getEducacion() {
        return educacion;
    }

    public void setEducacion(String educacion) {
        this.educacion = educacion;
    }

    public String getTituloPractica() {
        return tituloPractica;
    }

    public void setTituloPractica(String tituloPractica) {
        this.tituloPractica = tituloPractica;
    }
}