package com.example.ezfct.DTO;

public class EmpresaDTO {
    private String nif, nombre, direccion, emailContacto, telefono;

    public EmpresaDTO(String nif, String nombre, String direccion, String emailContacto, String telefono) {
        this.nif = nif;
        this.nombre = nombre;
        this.direccion = direccion;
        this.emailContacto = emailContacto;
        this.telefono = telefono;
    }

    public String getNif() { return nif; }
    public String getNombre() { return nombre; }
    public String getDireccion() { return direccion; }
    public String getEmailContacto() { return emailContacto; }
    public String getTelefono() { return telefono; }
}