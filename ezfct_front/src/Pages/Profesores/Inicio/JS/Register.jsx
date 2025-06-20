"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ButtonComp from "../../../../Components/JSX/ButtonComp.jsx"
import "../CSS/Register.css"
import logo from "../../../Imagenes/logo.gif"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../../../constants.js"
const RegistroProfesor = ({ onRegister = () => {}, onBack = () => {}, logoSrc }) => {
  // Estados para el formulario
  const [profesor, setProfesor] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    departamento: "",
    rol: "PROFESOR",
  })

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loaded, setLoaded] = useState(true) // Forzado a true
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentStep, setCurrentStep] = useState(1) // Para dividir el formulario en pasos
  const [respuesta, setRespuesta] = useState(null)

  const particlesContainerRef = useRef(null)
  const formRef = useRef(null)

  // Efecto para la animación de entrada
  useEffect(() => {
    // Marcar como cargado inmediatamente
    setLoaded(true)

    // Crear partículas iniciales
    createInitialParticles()

    // Seguimiento del ratón
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Intervalo para animar partículas
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        })),
      )
    }, 50)

    // Ajustar partículas al cambiar el tamaño de la ventana
    const handleResize = () => {
      createInitialParticles()
    }

    window.addEventListener("resize", handleResize)

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [])

  // Función para crear partículas iniciales
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

  // Función para crear efecto de explosión de partículas
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

    // Eliminar partículas de explosión después de un tiempo
    setTimeout(() => {
      setParticles((prev) => prev.slice(0, 50))
    }, 1000)
  }

  // Manejar cambios en los campos del formulario
  const handleProfesorChange = (e) => {
    const { name, value } = e.target
    setProfesor((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Validar el formulario
  const validateForm = () => {
    // Validar que todos los campos estén completos
    const { nombre, apellido, email, password, departamento } = profesor

    if (currentStep === 1) {
      if (!nombre || !apellido || !departamento) {
        return false
      }
    } else {
      if (!email || !password) {
        return false
      }
    }

    return true
  }

  // Manejar el cambio de paso
  const handleNextStep = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Efecto de vibración si faltan campos
      formRef.current.classList.add("profesor-shake")
      setTimeout(() => {
        formRef.current.classList.remove("profesor-shake")
      }, 500)
      return
    }

    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")

    // Cambiar al siguiente paso
    setCurrentStep(2)
  }

  // Manejar envío del formulario
  const enviarFormulario = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Efecto de vibración si faltan campos
      formRef.current.classList.add("profesor-shake")
      setTimeout(() => {
        formRef.current.classList.remove("profesor-shake")
      }, 500)
      return
    }

    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")

    // Preparar payload para enviar
    const payload = {
      ...profesor,
    }

    // Enviar datos a la API
    fetch(API_URL + "/auth/registeruser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) return res.text().then((text) => Promise.reject(text))
        return res.json()
      })
      .then((data) => {
        setRespuesta({ tipo: "success", data })
        // Redirigir después de un registro exitoso
        setTimeout(() => navigate("/profesores/login"), 1500)
      })
      .catch((err) => setRespuesta({ tipo: "error", message: err }))
  }

  // Manejar clic en botón de volver
  const handleBack = () => {
    if (currentStep === 2) {
      // Si estamos en el paso 2, volver al paso 1
      createExplosionEffect(mousePosition.x, mousePosition.y, "#f59e0b")
      setCurrentStep(1)
    } else {
      // Si estamos en el paso 1, volver a la pantalla anterior
      createExplosionEffect(50, 50, "#f43f5e")
      setTimeout(() => navigate(-1), 300)
    }
  }

  return (
    <div className="profesor-registro-container" style={{ opacity: 1, transform: "none" }}>
      {/* Partículas de fondo */}
      <div className="profesor-particles-container" ref={particlesContainerRef}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="profesor-particle"
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

      {/* Botón de volver atrás */}
      <button
        className={`profesor-back-button ${loaded ? "loaded" : ""}`}
        onClick={handleBack}
        aria-label="Volver"
        style={{ transform: "scale(1)", opacity: 1 }}
      >
        ←
      </button>

      {/* Contenedor principal */}
      <div
        className={`profesor-registro-card ${loaded ? "loaded" : ""}`}
        style={{ transform: "rotateX(0deg) scale(1)", opacity: 1 }}
      >
        {/* Sección del logo */}
        <div className="profesor-logo-section">
          {/* Círculos decorativos */}
          <div className="profesor-decorative-circle profesor-circle-1" />
          <div className="profesor-decorative-circle profesor-circle-2" />

          {/* Logo con animación */}
          <div className={`profesor-logo-container ${loaded ? "loaded" : ""}`} style={{ transform: "scale(1)" }}>
            <img src={logo || "/placeholder.svg"} alt="Logo" className="profesor-logo" />
          </div>

          {/* Título y subtítulo */}
          <h1 className={`profesor-title ${loaded ? "loaded" : ""}`} style={{ opacity: 1, transform: "translateY(0)" }}>
            EasyFCT
          </h1>
          <div
            className={`profesor-divider ${loaded ? "loaded" : ""}`}
            style={{ opacity: 1, transform: "scaleX(1)" }}
          />
          <p
            className={`profesor-subtitle ${loaded ? "loaded" : ""}`}
            style={{ opacity: 1, transform: "translateY(0)" }}
          >
            {currentStep === 1 ? "Registro de Profesor - Paso 1/2" : "Registro de Profesor - Paso 2/2"}
          </p>

          {/* Indicador de pasos */}
          <div
            className={`profesor-steps-indicator ${loaded ? "loaded" : ""}`}
            style={{ opacity: 1, transform: "translateY(0)" }}
          >
            <div className={`profesor-step ${currentStep === 1 ? "active" : "completed"}`}>1</div>
            <div className="profesor-step-line"></div>
            <div className={`profesor-step ${currentStep === 2 ? "active" : ""}`}>2</div>
          </div>

          {/* Línea decorativa */}
          <div className={`profesor-gradient-line ${loaded ? "loaded" : ""}`} style={{ opacity: 1 }} />
        </div>

        {/* Formulario */}
        <form
          className="profesor-form-container"
          ref={formRef}
          onSubmit={currentStep === 1 ? handleNextStep : enviarFormulario}
          style={{ opacity: 1, transform: "translateY(0)" }}
        >
          {/* Paso 1: Datos personales */}
          {currentStep === 1 && (
            <div style={{ opacity: 1, transform: "translateY(0)" }}>
              {/* Campo de Nombre */}
              <div
                className={`profesor-input-group ${loaded ? "loaded" : ""}`}
                style={{ opacity: 1, transform: "translateY(0)" }}
              >
                <label htmlFor="nombre">Nombre</label>
                <div className="profesor-input-wrapper">
                  <span className="profesor-input-icon">👤</span>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={profesor.nombre}
                    onChange={handleProfesorChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de Apellido */}
              <div
                className={`profesor-input-group ${loaded ? "loaded" : ""}`}
                style={{ opacity: 1, transform: "translateY(0)" }}
              >
                <label htmlFor="apellido">Apellido</label>
                <div className="profesor-input-wrapper">
                  <span className="profesor-input-icon">👤</span>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    placeholder="Tu apellido"
                    value={profesor.apellido}
                    onChange={handleProfesorChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de Departamento */}
              <div
                className={`profesor-input-group ${loaded ? "loaded" : ""}`}
                style={{ opacity: 1, transform: "translateY(0)" }}
              >
                <label htmlFor="departamento">Departamento</label>
                <div className="profesor-input-wrapper">
                  <span className="profesor-input-icon">📚</span>
                  <input
                    type="text"
                    id="departamento"
                    name="departamento"
                    placeholder="Ej: Informática, Matemáticas"
                    value={profesor.departamento}
                    onChange={handleProfesorChange}
                    required
                  />
                </div>
              </div>

              {/* Botón de siguiente paso */}
              <div
                className={`profesor-button-container ${loaded ? "loaded" : ""}`}
                style={{ opacity: 1, transform: "translateY(0)" }}
              >
                <ButtonComp className="profesor-btn--next" icon="➡️" type="submit">
                  Siguiente
                </ButtonComp>
              </div>
            </div>
          )}

          {/* Paso 2: Datos de acceso */}
          {currentStep === 2 && (
            <div style={{ opacity: 1, transform: "translateY(0)" }}>
              {/* Campo de Email */}
              <div
                className={`profesor-input-group ${loaded ? "loaded" : ""}`}
                style={{ opacity: 1, transform: "translateY(0)" }}
              >
                <label htmlFor="email">Email</label>
                <div className="profesor-input-wrapper">
                  <span className="profesor-input-icon">✉️</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={profesor.email}
                    onChange={handleProfesorChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de Contraseña */}
              <div
                className={`profesor-input-group ${loaded ? "loaded" : ""}`}
                style={{ opacity: 1, transform: "translateY(0)" }}
              >
                <label htmlFor="password">Contraseña</label>
                <div className="profesor-input-wrapper">
                  <span className="profesor-input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={profesor.password}
                    onChange={handleProfesorChange}
                    required
                  />
                  <button
                    type="button"
                    className="profesor-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🔒" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Botón de registro */}
              <div
                className={`profesor-button-container ${loaded ? "loaded" : ""}`}
                style={{ opacity: 1, transform: "translateY(0)" }}
              >
                <ButtonComp className="profesor-btn--register" icon="✨" type="submit">
                  Completar Registro
                </ButtonComp>
              </div>
            </div>
          )}

          {/* Texto adicional */}
          <div
            className={`profesor-additional-text ${loaded ? "loaded" : ""}`}
            style={{ opacity: 1, transform: "translateY(0)" }}
          >
            <p>
              ¿Ya tienes una cuenta?{" "}
              <a href="#" onClick={() => navigate("/profesores/login")}>
                Inicia sesión
              </a>
            </p>
          </div>
        </form>


        {/* Pie de página */}
        <div className="profesor-footer">
          <p className={loaded ? "loaded" : ""} style={{ opacity: 1 }}>
            © 2025 EasyFCT - Innovación Educativa
          </p>
        </div>
      </div>
    </div>
  )
}

RegistroProfesor.propTypes = {
  onRegister: PropTypes.func,
  onBack: PropTypes.func,
  logoSrc: PropTypes.string,
}

export default RegistroProfesor
