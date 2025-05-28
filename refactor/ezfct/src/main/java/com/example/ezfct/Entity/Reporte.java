package com.example.ezfct.Entity;

import com.example.ezfct.Model.Enums.Rol;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "Reporte")
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("idReporte")
    private int idReporte;

    @JsonProperty("email")
    private String email;

    @Enumerated(EnumType.STRING)
    @JsonProperty("rol")
    private Rol rol;

    @Lob
    @JsonProperty("mensaje")
    private String mensaje;

    @Lob
    @JsonProperty("respuesta")
    private String respuesta;


    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
