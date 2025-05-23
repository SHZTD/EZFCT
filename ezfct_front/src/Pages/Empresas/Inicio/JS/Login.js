"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ButtonComp from "../../../../Components/JSX/ButtonComp.js"
import LogoDefault from "../../../Imagenes/logo.gif"
import { useNavigate } from "react-router-dom"
import "../CSS/Login.css"

const Login = ({ onLogin = () => {}, onBack = () => {}, logo }) => {
  let API_URL = "http://192.168.1.139:7484/auth/empresalogin"

  // Estados para el formulario
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Referencias para elementos DOM
  const formRef = useRef(null)

  // Efecto para la animación de entrada
  useEffect(() => {
    // Marcar como cargado para iniciar animaciones
    setTimeout(() => setLoaded(true), 100)
  }, [])

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      // Efecto de vibración si faltan campos
      formRef.current.classList.add("shake")
      setTimeout(() => {
        formRef.current.classList.remove("shake")
      }, 500)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(API_URL, {
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
    setTimeout(() => navigate(-1), 300)
  }

  return (
    <div className="login-container">
      {/* Botón de volver atrás */}
      <button className={`back-button ${loaded ? "loaded" : ""}`} onClick={handleBack} aria-label="Volver">
        ←
      </button>

      {/* Contenedor principal */}
      <div className={`login-card ${loaded ? "loaded" : ""}`}>
        {/* Sección del logo */}
        <div className="logo-section">
          {/* Círculos decorativos */}
          <div className="decorative-circle circle-1" />
          <div className="decorative-circle circle-2" />

          {/* Logo con animación */}
          <div className={`logo-container ${loaded ? "loaded" : ""}`}>
            <img src={logo || LogoDefault} className="logo" alt="Logo" />
          </div>

          {/* Título y subtítulo */}
          <h1 className={`title ${loaded ? "loaded" : ""}`}>EasyFCT</h1>
          <div className={`divider ${loaded ? "loaded" : ""}`} />
          <p className={`subtitle ${loaded ? "loaded" : ""}`}>Accede a tu cuenta</p>

          {/* Línea decorativa */}
          <div className={`gradient-line ${loaded ? "loaded" : ""}`} />
        </div>

        {/* Formulario */}
        <form className="form-container" onSubmit={handleSubmit} ref={formRef}>
          {/* Mensaje de error */}
          {error && <div className="error-message">{error}</div>}

          {/* Campo de email */}
          <div className={`input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.3s" }}>
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                id="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className={`input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.4s" }}>
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>
          </div>

          {/* Enlace de olvidé mi contraseña */}
          <div className={`forgot-password ${loaded ? "loaded" : ""}`}>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón de login usando ButtonComp */}
          <div className={`button-container ${loaded ? "loaded" : ""}`}>
            <ButtonComp className="btn--login" icon="🔑" type="submit" disabled={isLoading} transitionDelay="1.6s">
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </ButtonComp>
          </div>

          {/* Texto adicional */}
          <div className={`additional-text ${loaded ? "loaded" : ""}`}>
            <p>
              ¿No tienes una cuenta?{" "}
              <a href="#" onClick={() => navigate("/empresas/register")}>
                Regístrate
              </a>
            </p>
          </div>
        </form>

        {/* Pie de página */}
        <div className="footer">
          <p className={loaded ? "loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
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
