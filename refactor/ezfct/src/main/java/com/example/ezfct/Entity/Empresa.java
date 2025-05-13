package com.example.ezfct.Entity;
import com.example.ezfct.Model.Enums.Rol;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Empresa")
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEmpresa;
    @Column(unique = true, nullable = false)
    private String nif;
    private String direccion;
    @Column(unique = true, nullable = false)
    private String emailContacto;
    private String telefono;
    private String nombre;
    private String password;

    @Enumerated(EnumType.STRING)
    private final Rol rol = Rol.EMPRESA;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Practicas> practicas;

    public int getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(int idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNIF() {
        return nif;
    }

    public void setNIF(String nif) {
        this.nif = nif;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<Practicas> getPracticas() {
        return practicas;
    }

    public void setPracticas(List<Practicas> practicas) {
        this.practicas = practicas;
    }

    public String getPassword() {
        return password;
    }

    public void setContrasenya(String contrasenya) {
        this.password = contrasenya;
    }
}