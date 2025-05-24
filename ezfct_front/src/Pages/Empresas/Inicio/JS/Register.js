"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ButtonComp from "../../../../Components/JSX/ButtonComp.js"
import "../CSS/Register.css"
import logo from "../../../Imagenes/logo.gif"
import { useNavigate } from "react-router-dom"

const RegistroEmpresa = ({ onRegister = () => {}, onBack = () => {}, logoSrc }) => {

  let API_URL = "http://192.168.1.139:7484/auth/registerempresa";
  // Estados para el formulario
  const [empresa, setEmpresa] = useState({
    nif: "",
    direccion: "",
    emailContacto: "",
    telefono: "",
    nombre: "",
    password: ""
  })

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentStep, setCurrentStep] = useState(1) // Para dividir el formulario en pasos
  const [respuesta, setRespuesta] = useState(null)

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
  const handleEmpresaChange = (e) => {
    const { name, value } = e.target
    setEmpresa((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Validar el formulario
  const validateForm = () => {
    // Validar que todos los campos estén completos
    const { nif, nombre, direccion, telefono, emailContacto, password } = empresa

    if (currentStep === 1) {
      if (!nif || !nombre || !direccion) {
        return false
      }
    } else {
      if (!telefono || !emailContacto || !password) {
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
      formRef.current.classList.add("shake")
      setTimeout(() => {
        formRef.current.classList.remove("shake")
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
      formRef.current.classList.add("shake")
      setTimeout(() => {
        formRef.current.classList.remove("shake")
      }, 500)
      return
    }

    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")

    // Preparar payload para enviar
    const payload = {
      ...empresa,
    }

    // Enviar datos a la API
    fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
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
        setTimeout(() => navigate("/empresas/login"), 1500)
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
    <div className="register-container">
      {/* Partículas de fondo */}
      <div className="particles-container" ref={particlesContainerRef}>
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

      {/* Efecto de luz que sigue al cursor */}
      <div
        className="cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Botón de volver atrás */}
      <button className={`back-button ${loaded ? "loaded" : ""}`} onClick={handleBack} aria-label="Volver">
        ←
      </button>

      {/* Contenedor principal */}
      <div className={`register-card ${loaded ? "loaded" : ""}`}>
        {/* Sección del logo */}
        <div className="logo-section">
          {/* Círculos decorativos */}
          <div className="decorative-circle circle-1" />
          <div className="decorative-circle circle-2" />

          {/* Logo con animación */}
          <div className={`logo-container ${loaded ? "loaded" : ""}`}>
            <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
          </div>

          {/* Título y subtítulo */}
          <h1 className={`title ${loaded ? "loaded" : ""}`}>EasyFCT</h1>
          <div className={`divider ${loaded ? "loaded" : ""}`} />
          <p className={`subtitle ${loaded ? "loaded" : ""}`}>
            {currentStep === 1 ? "Registro de Empresa - Paso 1/2" : "Registro de Empresa - Paso 2/2"}
          </p>

          {/* Indicador de pasos */}
          <div className={`steps-indicator ${loaded ? "loaded" : ""}`}>
            <div className={`step ${currentStep === 1 ? "active" : "completed"}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${currentStep === 2 ? "active" : ""}`}>2</div>
          </div>

          {/* Línea decorativa */}
          <div className={`gradient-line ${loaded ? "loaded" : ""}`} />
        </div>

        {/* Formulario */}
        <form className="form-container" ref={formRef} onSubmit={currentStep === 1 ? handleNextStep : enviarFormulario}>
          {/* Paso 1: Datos de la empresa */}
          {currentStep === 1 && (
            <>
              {/* Campo de NIF */}
              <div className={`input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.3s" }}>
                <label htmlFor="nif">NIF/CIF</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏢</span>
                  <input
                    type="text"
                    id="nif"
                    name="nif"
                    placeholder="B12345678"
                    value={empresa.nif}
                    onChange={handleEmpresaChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de Nombre */}
              <div className={`input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.4s" }}>
                <label htmlFor="nombre">Nombre de la empresa</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏭</span>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Empresa S.L."
                    value={empresa.nombre}
                    onChange={handleEmpresaChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de Dirección */}
              <div className={`input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.5s" }}>
                <label htmlFor="direccion">Dirección</label>
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    placeholder="Calle Ejemplo, 123"
                    value={empresa.direccion}
                    onChange={handleEmpresaChange}
                    required
                  />
                </div>
              </div>

              {/* Botón de siguiente paso */}
              <div className={`button-container ${loaded ? "loaded" : ""}`}>
                <ButtonComp className="btn--next" icon="➡️" type="submit" transitionDelay="1.6s">
                  Siguiente
                </ButtonComp>
              </div>
            </>
          )}

          {/* Paso 2: Datos de contacto y acceso */}
          {currentStep === 2 && (
            <>
              {/* Campo de Teléfono */}
              <div className={`input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.3s" }}>
                <label htmlFor="telefono">Teléfono</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    placeholder="912345678"
                    value={empresa.telefono}
                    onChange={handleEmpresaChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de Email */}
              <div className={`input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.4s" }}>
                <label htmlFor="emailContacto">Email de contacto</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    id="emailContacto"
                    name="emailContacto"
                    placeholder="contacto@empresa.com"
                    value={empresa.emailContacto}
                    onChange={handleEmpresaChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de Contraseña */}
              <div className={`input-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "1.5s" }}>
                <label htmlFor="contrasenya">Contraseña</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={empresa.password}
                    onChange={handleEmpresaChange}
                    required
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "🔒" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Botón de registro */}
              <div className={`button-container ${loaded ? "loaded" : ""}`}>
                <ButtonComp className="btn--register" icon="✨" type="submit" transitionDelay="1.6s">
                  Completar Registro
                </ButtonComp>
              </div>
            </>
          )}

          {/* Texto adicional */}
          <div className={`additional-text ${loaded ? "loaded" : ""}`}>
            <p>
              ¿Ya tienes una cuenta?{" "}
              <a href="#" onClick={() => navigate("/empresas/login")}>
                Inicia sesión
              </a>
            </p>
          </div>
        </form>

        {/* Mensaje de respuesta */}
        {respuesta && (
          <div className={`respuesta ${respuesta.tipo} ${loaded ? "loaded" : ""}`}>
            {respuesta.tipo === "success" ? (
              <>
                <p style={{ color: "green" }}>Empresa registrada con éxito!</p>
                <pre>{JSON.stringify(respuesta.data, null, 2)}</pre>
              </>
            ) : (
              <p style={{ color: "red" }}>Error: {respuesta.message}</p>
            )}
          </div>
        )}

        {/* Pie de página */}
        <div className="footer">
          <p className={loaded ? "loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  )
}

RegistroEmpresa.propTypes = {
  onRegister: PropTypes.func,
  onBack: PropTypes.func,
  logoSrc: PropTypes.string,
}

export default RegistroEmpresa
