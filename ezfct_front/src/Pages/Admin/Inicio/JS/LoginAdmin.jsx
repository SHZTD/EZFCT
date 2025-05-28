"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ButtonComp from "../../../../Components/JSX/ButtonComp.js"
import LogoDefault from "../../../Imagenes/ajuste.png"
import { useNavigate } from "react-router-dom"
import "../CSS/LoginAdmin.css"

const tokenVar = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBlemZjdC5jb20iLCJpZCI6Mywicm9sIjoiQURNSU4iLCJpYXQiOjE3NDg0Njk2MjAsImV4cCI6MTc0ODU1NjAyMH0.VryQm6V7ExV0oDih9tbME8OCK8hp-OcZKsPiB8nPp3w"
const LoginAdmin = ({ onLogin = () => {}, onBack = () => {}, logo }) => {
  localStorage.setItem('token', tokenVar);
  // Estados para el formulario
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Referencias para elementos DOM
  const particlesContainerRef = useRef(null)
  const formRef = useRef(null)

  // Efecto para la animación de entrada
  useEffect(() => {
    // Marcar como cargado para iniciar animaciones
    setTimeout(() => setLoaded(true), 100)

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

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
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
      color: ["#8b5cf6", "#f43f5e", "#f59e0b", "#10b981"][Math.floor(Math.random() * 4)],
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

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      // Efecto de vibración si faltan campos
      formRef.current.classList.add("admin-shake")
      setTimeout(() => {
        formRef.current.classList.remove("admin-shake")
      }, 500)
      return
    }

    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")

    // Llamar a la función de login
    setTimeout(() => {
      onLogin({ email, password })
    }, 300)
  }

  // Manejar clic en botón de volver
  const handleBack = () => {
    createExplosionEffect(50, 50, "#f43f5e")
    setTimeout(() => navigate("/"), 300)
  }

  const guardarToken = (token) => {
    localStorage.setItem("adminToken", token)
  }

  const handleLogin = async () => {
    if (!email || !password) {
      formRef.current.classList.add("admin-shake")
      setTimeout(() => {
        formRef.current.classList.remove("admin-shake")
      }, 500)
      return
    }

    try {
      // Simulación de login de admin
      if (email === "admin@ezfct.com" && password === "admin123") {
        guardarToken("admin-token-123")
        localStorage.setItem("adminEmail", email)
        createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
        setTimeout(() => {
          navigate("/admin/dashboard")
        }, 300)
      } else {
        alert("Credenciales incorrectas")
        formRef.current.classList.add("admin-shake")
        setTimeout(() => {
          formRef.current.classList.remove("admin-shake")
        }, 500)
      }
    } catch (error) {
      alert("Error de red: " + error.message)
    }
  }

  return (
    <div className="admin-login-container">
      {/* Partículas de fondo */}
      <div className="admin-particles-container" ref={particlesContainerRef}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="admin-particle"
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

      {/* Efecto de luz que sigue al cursor */}
      <div
        className="admin-cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Botón de volver atrás */}
      <button className={`admin-back-button ${loaded ? "loaded" : ""}`} onClick={handleBack} aria-label="Volver">
        ←
      </button>

      {/* Contenedor principal */}
      <div className={`admin-login-card ${loaded ? "loaded" : ""}`}>
        {/* Sección del logo */}
        <div className="admin-logo-section">
          {/* Círculos decorativos */}
          <div className="admin-decorative-circle admin-circle-1" />
          <div className="admin-decorative-circle admin-circle-2" />

          {/* Logo con animación */}
          <div className={`admin-logo-container ${loaded ? "loaded" : ""}`}>
            <img src={logo || LogoDefault} className="admin-logo" alt="Admin Logo" />
          </div>

          {/* Título y subtítulo */}
          <h1 className={`admin-title ${loaded ? "loaded" : ""}`}>Admin Panel</h1>
          <div className={`admin-divider ${loaded ? "loaded" : ""}`} />
          <p className={`admin-subtitle ${loaded ? "loaded" : ""}`}>Panel de Administración</p>

          {/* Línea decorativa */}
          <div className={`admin-gradient-line ${loaded ? "loaded" : ""}`} />
        </div>

        {/* Formulario */}
        <form className="admin-form-container" onSubmit={handleSubmit} ref={formRef}>
          {/* Campo de email */}
          <div className={`admin-input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.3s" }}>
            <label htmlFor="email">Email Administrativo</label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">👤</span>
              <input
                type="email"
                id="email"
                placeholder="admin@ezfct.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className={`admin-input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.4s" }}>
            <label htmlFor="password">Contraseña</label>
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">🔐</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="admin-toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>
          </div>

          {/* Enlace de olvidé mi contraseña */}
          <div className={`admin-forgot-password ${loaded ? "loaded" : ""}`}>
            <a href="#">Acceso de emergencia</a>
          </div>

          {/* Botón de login usando ButtonComp */}
          <div className={`admin-button-container ${loaded ? "loaded" : ""}`}>
            <ButtonComp className="admin-btn--login" icon="🔑" onClick={handleLogin} transitionDelay="1.6s">
              Acceder al Panel
            </ButtonComp>
          </div>
        </form>

        {/* Pie de página */}
        <div className="admin-footer">
          <p className={loaded ? "loaded" : ""}>© 2025 EasyFCT - Panel Administrativo</p>
        </div>
      </div>
    </div>
  )
}

LoginAdmin.propTypes = {
  onLogin: PropTypes.func,
  onBack: PropTypes.func,
  logo: PropTypes.string,
}

export default LoginAdmin
