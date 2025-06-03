package com.example.ezfct.DTO;

import com.example.ezfct.Model.Enums.Rol;

public class UsuarioDTO {
    private String nombre;
    private String apellido;
    private String email;
    private Rol rol;

    public UsuarioDTO(String nombre, String apellido, String email, Rol rol) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
    }

    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getEmail() { return email; }
    public Rol getRol() { return rol; }
}