package com.example.ezfct.Entity;
import com.example.ezfct.Model.Enums.EstadoPractica;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Alumno")
public class Alumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAlumno;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPractica estadoPractica;

    @OneToMany(mappedBy = "alumno", cascade = CascadeType.ALL)
    private List<Postulacion> postulaciones;

    @OneToMany(mappedBy = "alumno", cascade = CascadeType.ALL)
    private List<Diario> diarios;

    public int getIdAlumno() {
        return idAlumno;
    }

    public void setIdAlumno(int idAlumno) {
        this.idAlumno = idAlumno;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public EstadoPractica getEstadoPractica() {
        return estadoPractica;
    }

    public void setEstadoPractica(EstadoPractica estadoPractica) {
        this.estadoPractica = estadoPractica;
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