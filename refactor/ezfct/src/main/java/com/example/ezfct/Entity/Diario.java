package com.example.ezfct.Entity;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Diario")
public class Diario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDiario;
    
    @ManyToOne
    @JoinColumn(name = "id_practica", nullable = false)
    private Practicas practica;

    @ManyToOne
    @JoinColumn(name = "id_alumno", nullable = false)
    private Alumno alumno;

    @Lob private String resumen;
    private Date fecha;

    public int getIdDiario() {
        return idDiario;
    }

    public void setIdDiario(int idDiario) {
        this.idDiario = idDiario;
    }

    public Practicas getPractica() {
        return practica;
    }

    public void setPractica(Practicas practica) {
        this.practica = practica;
    }

    public Alumno getAlumno() {
        return alumno;
    }

    public void setAlumno(Alumno alumno) {
        this.alumno = alumno;
    }

    public String getResumen() {
        return resumen;
    }

    public void setResumen(String resumen) {
        this.resumen = resumen;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }
}