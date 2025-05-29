"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ButtonComp from "../../../../Components/JSX/ButtonComp.js"
import LogoDefault from "../../../Imagenes/logo.gif"
import { useNavigate } from "react-router-dom"
import {API_URL} from "../../../../constants.js"
import "../CSS/Login.css"

const Login = ({ onLogin = () => {}, onBack = () => {}, logo }) => {

  // Estados para el formulario
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Referencias para elementos DOM
  const formRef = useRef(null)
  const particlesContainerRef = useRef(null)

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
      color: ["#f97316", "#fb923c", "#fdba74", "#fed7aa"][Math.floor(Math.random() * 4)],
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
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      // Efecto de vibración si faltan campos
      formRef.current.classList.add("empresa-shake")
      setTimeout(() => {
        formRef.current.classList.remove("empresa-shake")
      }, 500)
      return
    }

    setIsLoading(true)
    setError("")

    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f97316")

    try {
      const response = await fetch(API_URL + "/auth/empresalogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem("token", data.token)

        // Navegar a la página de ofertas
        setTimeout(() => {
          navigate("/empresas/OfertasE")
        }, 300)
      } else {
        setError(data.message || "Error al iniciar sesión")
      }
    } catch (error) {
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar clic en botón de volver
  const handleBack = () => {
    createExplosionEffect(50, 50, "#f43f5e")
    setTimeout(() => navigate(-1), 300)
  }

  return (
    <div className="empresa-login-container">
      {/* Partículas de fondo */}
      <div className="empresa-particles-container" ref={particlesContainerRef}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="empresa-particle"
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
        className="empresa-cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Botón de volver atrás */}
      <button className={`empresa-back-button ${loaded ? "loaded" : ""}`} onClick={handleBack} aria-label="Volver">
        ←
      </button>

      {/* Contenedor principal */}
      <div className={`empresa-login-card ${loaded ? "loaded" : ""}`}>
        {/* Sección del logo */}
        <div className="empresa-logo-section">
          {/* Círculos decorativos */}
          <div className="empresa-decorative-circle empresa-circle-1" />
          <div className="empresa-decorative-circle empresa-circle-2" />

          {/* Logo con animación */}
          <div className={`empresa-logo-container ${loaded ? "loaded" : ""}`}>
            <img src={logo || LogoDefault} className="empresa-logo" alt="Logo" />
          </div>

          {/* Título y subtítulo */}
          <h1 className={`empresa-title ${loaded ? "loaded" : ""}`}>EasyFCT</h1>
          <div className={`empresa-divider ${loaded ? "loaded" : ""}`} />
          <p className={`empresa-subtitle ${loaded ? "loaded" : ""}`}>Portal de Empresas</p>

          {/* Línea decorativa */}
          <div className={`empresa-gradient-line ${loaded ? "loaded" : ""}`} />
        </div>

        {/* Formulario */}
        <form className="empresa-form-container" onSubmit={handleSubmit} ref={formRef}>
          {/* Mensaje de error */}
          {error && <div className="empresa-error-message">{error}</div>}

          {/* Campo de email */}
          <div className={`empresa-input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.3s" }}>
            <label htmlFor="email">Email</label>
            <div className="empresa-input-wrapper">
              <span className="empresa-input-icon">🏢</span>
              <input
                type="email"
                id="email"
                placeholder="empresa@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className={`empresa-input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.4s" }}>
            <label htmlFor="password">Contraseña</label>
            <div className="empresa-input-wrapper">
              <span className="empresa-input-icon">🔐</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="empresa-toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>
          </div>

          {/* Enlace de olvidé mi contraseña */}
          <div className={`empresa-forgot-password ${loaded ? "loaded" : ""}`}>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón de login usando ButtonComp */}
          <div className={`empresa-button-container ${loaded ? "loaded" : ""}`}>
            <ButtonComp
              className="empresa-btn--login"
              icon="🏢"
              type="submit"
              disabled={isLoading}
              transitionDelay="1.6s"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </ButtonComp>
          </div>

          {/* Texto adicional */}
          <div className={`empresa-additional-text ${loaded ? "loaded" : ""}`}>
            <p>
              ¿No tienes una cuenta?{" "}
              <a href="#" onClick={() => navigate("/empresas/register")}>
                Regístrate
              </a>
            </p>
          </div>
        </form>

        {/* Pie de página */}
        <div className="empresa-footer">
          <p className={loaded ? "loaded" : ""}>© 2025 EasyFCT - Portal de Empresas</p>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {
  onLogin: PropTypes.func,
  onBack: PropTypes.func,
  logo: PropTypes.string,
}

export default Login
