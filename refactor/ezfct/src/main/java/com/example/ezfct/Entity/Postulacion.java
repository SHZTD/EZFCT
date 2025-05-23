package com.example.ezfct.Entity;
import com.example.ezfct.Model.Enums.EstadoPostulacion;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Postulacion")
public class Postulacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPostulacion;

    @ManyToOne
    @JoinColumn(name = "id_alumno", nullable = false)
    @JsonIgnoreProperties("postulaciones")
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "id_practica", nullable = false)
    @JsonIgnoreProperties("postulaciones")
    private Practicas practica;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPostulacion estado;

    private Date fechaPostulacion;

    public int getIdPostulacion() {
        return idPostulacion;
    }

    public void setIdPostulacion(int idPostulacion) {
        this.idPostulacion = idPostulacion;
    }

    public Alumno getAlumno() {
        return alumno;
    }

    public void setAlumno(Alumno alumno) {
        this.alumno = alumno;
    }

    public Practicas getPractica() {
        return practica;
    }

    public void setPractica(Practicas practica) {
        this.practica = practica;
    }

    public EstadoPostulacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoPostulacion estado) {
        this.estado = estado;
    }

    public Date getFechaPostulacion() {
        return fechaPostulacion;
    }

    public void setFechaPostulacion(Date fechaPostulacion) {
        this.fechaPostulacion = fechaPostulacion;
    }
}