"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, X } from "lucide-react"
import "../CSS/CrearAlumno.css"

const CrearAlumno = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const navigate = useNavigate()

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    departamento: "",
    biografia: "",
    habilidades: "",
    educacion: "",
    experiencia: "",
    disponibilidad: "Tiempo completo",
    portfolio: "",
  })

  // Efecto para la animación de entrada y partículas
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
    createInitialParticles()

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.pageX, y: e.pageY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        })),
      )
    }, 50)

    const handleResize = () => {
      createInitialParticles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [])

  const createInitialParticles = () => {
    const newParticles = Array.from({ length: 50 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
      color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][Math.floor(Math.random() * 4)],
    }))

    setParticles(newParticles)
  }

  const createExplosionEffect = (x, y, color) => {
    const explosionParticles = Array.from({ length: 30 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      size: Math.random() * 8 + 2,
      speedX: (Math.random() - 0.5) * 15,
      speedY: (Math.random() - 0.5) * 15,
      opacity: 1,
      color,
    }))

    setParticles((prev) => [...prev, ...explosionParticles])

    setTimeout(() => {
      setParticles((prev) => prev.slice(0, 50))
    }, 1000)
  }

  const handleGoBack = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    setTimeout(() => navigate(-1), 300)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Por favor, completa todos los campos obligatorios." })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden." })
      return false
    }

    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "error", text: "Por favor, introduce un email válido." })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // Simular llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Aquí iría la llamada real al backend
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        departamento: formData.departamento,
        rol: "ALUMNO",
      }

      const alumnoData = {
        biografia: formData.biografia,
        habilidades: formData.habilidades,
        educacion: formData.educacion,
        experiencia: formData.experiencia,
        disponibilidad: formData.disponibilidad,
        portfolio: formData.portfolio,
        estadoPractica: "PENDIENTE",
      }

      console.log("Usuario creado:", userData)
      console.log("Datos del alumno:", alumnoData)

      createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
      setMessage({ type: "success", text: "¡Alumno creado exitosamente!" })

      // Limpiar formulario
      setTimeout(() => {
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
          confirmPassword: "",
          departamento: "",
          biografia: "",
          habilidades: "",
          educacion: "",
          experiencia: "",
          disponibilidad: "Tiempo completo",
          portfolio: "",
        })
        setMessage({ type: "", text: "" })
      }, 3000)
    } catch (error) {
      console.error("Error al crear alumno:", error)
      setMessage({ type: "error", text: "Error al crear el alumno. Inténtalo de nuevo." })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmPassword: "",
      departamento: "",
      biografia: "",
      habilidades: "",
      educacion: "",
      experiencia: "",
      disponibilidad: "Tiempo completo",
      portfolio: "",
    })
    setMessage({ type: "", text: "" })
  }

  return (
    <div className="crear-alumno-page">
      {/* Partículas de fondo */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      <div className="crear-alumno-container">
        {/* Header */}
        <header className={`page-header ${loaded ? "loaded" : ""}`}>
          <div className="header-content">
            <h1 className="page-title">CREATE STUDENT</h1>
            <p className="page-subtitle">
              Add a new student to the system with their academic and personal information
            </p>
          </div>
          <div className="header-gradient"></div>
        </header>

        {/* Botón de volver */}
        <div className={`actions-container ${loaded ? "loaded" : ""}`}>
          <button className="back-button" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        {/* Formulario */}
        <div className={`form-container ${loaded ? "loaded" : ""} ${loading ? "loading" : ""}`}>
          {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Introduce el nombre"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apellidos *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Introduce los apellidos"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="ejemplo@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Departamento</label>
                <input
                  type="text"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Departamento académico"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar Contraseña *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Repite la contraseña"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Educación</label>
                <input
                  type="text"
                  name="educacion"
                  value={formData.educacion}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nivel educativo actual"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Disponibilidad</label>
                <select
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Tiempo completo">Tiempo completo</option>
                  <option value="Medio tiempo">Medio tiempo</option>
                  <option value="Fines de semana">Fines de semana</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Habilidades</label>
                <input
                  type="text"
                  name="habilidades"
                  value={formData.habilidades}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ej: JavaScript, Python, Comunicación, Trabajo en equipo..."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Portfolio/Enlaces</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://portfolio.ejemplo.com"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Biografía</label>
                <textarea
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Breve descripción del estudiante, sus intereses y objetivos..."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Experiencia</label>
                <textarea
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Experiencia previa, proyectos realizados, trabajos anteriores..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleReset} disabled={loading}>
                <X size={18} />
                Limpiar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  "Creando..."
                ) : (
                  <>
                    <Save size={18} />
                    Crear Alumno
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CrearAlumno
