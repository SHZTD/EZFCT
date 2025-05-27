"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/LoginAdmin.css"

const LoginAdmin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulación de login de admin
      if (formData.email === "admin@ezfct.com" && formData.password === "admin123") {
        localStorage.setItem("adminToken", "admin-token-123")
        localStorage.setItem("adminEmail", formData.email)
        navigate("/admin/dashboard")
      } else {
        alert("Credenciales incorrectas")
      }
    } catch (error) {
      console.error("Error en login:", error)
      alert("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate("/")
  }

  return (
    <div className="admin-login-container">
      <button className="admin-back-button" onClick={handleBack}>
        <img src="/EZFCT-master/ezfct_front/src/Pages/Imagenes/back.png" alt="Volver" />
      </button>

      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Panel</h1>
          <p>Sistema de Administración EZFCT</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="email">Email Administrativo</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@ezfct.com"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="admin-login-button" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Acceder al Panel"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginAdmin
