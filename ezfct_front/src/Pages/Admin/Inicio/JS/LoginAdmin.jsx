"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ButtonComp from "../../../../Components/JSX/ButtonComp.js"
import LogoDefault from "../../../Imagenes/ajuste.png"
import { useNavigate } from "react-router-dom"
import "../CSS/LoginAdmin.css"
import { API_URL } from "../../../../constants.js"

const LoginAdmin = ({ onBack = () => {}, logo }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const particlesContainerRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
    createInitialParticles()

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        }))
      )
    }, 50)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
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
      color: ["#8b5cf6", "#f43f5e", "#f59e0b", "#10b981"][Math.floor(Math.random() * 4)],
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

  const guardarToken = (token) => {
    localStorage.setItem("token", token)
  }

const handleLogin = async (e) => {
  e?.preventDefault()

  if (!email || !password) {
    formRef.current.classList.add("admin-shake")
    setTimeout(() => {
      formRef.current.classList.remove("admin-shake")
    }, 500)
    return
  }

  try {
    const response = await fetch(`${API_URL}/auth/userlogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Credenciales incorrectas")
    }

    const data = await response.json()

    if (data.token) {
      guardarToken(data.token)
      createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
      setTimeout(() => {
        navigate("/admin/dashboard")
      }, 300)
    } else {
      throw new Error("Respuesta inválida del servidor")
    }
  } catch (error) {
    alert("Error: " + error.message)
    formRef.current.classList.add("admin-shake")
    setTimeout(() => {
      formRef.current.classList.remove("admin-shake")
    }, 500)
  }
}

  const handleBack = () => {
    createExplosionEffect(50, 50, "#f43f5e")
    setTimeout(() => navigate("/"), 300)
  }

  return (
    <div className="admin-login-container">
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

      <button className={`admin-back-button ${loaded ? "loaded" : ""}`} onClick={handleBack} aria-label="Volver">
        ←
      </button>

      <div className={`admin-login-card ${loaded ? "loaded" : ""}`}>
        <div className="admin-logo-section">
          <div className="admin-decorative-circle admin-circle-1" />
          <div className="admin-decorative-circle admin-circle-2" />

          <div className={`admin-logo-container ${loaded ? "loaded" : ""}`}>
            <img src={logo || LogoDefault} className="admin-logo" alt="Admin Logo" />
          </div>

          <h1 className={`admin-title ${loaded ? "loaded" : ""}`}>Admin Panel</h1>
          <div className={`admin-divider ${loaded ? "loaded" : ""}`} />
          <p className={`admin-subtitle ${loaded ? "loaded" : ""}`}>Panel de Administración</p>
          <div className={`admin-gradient-line ${loaded ? "loaded" : ""}`} />
        </div>

        <form className="admin-form-container" onSubmit={handleLogin} ref={formRef}>
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

          <div className={`admin-forgot-password ${loaded ? "loaded" : ""}`}>
            <a href="#">Acceso de emergencia</a>
          </div>

          <div className={`admin-button-container ${loaded ? "loaded" : ""}`}>
            <ButtonComp className="admin-btn--login" icon="🔑" onClick={handleLogin} transitionDelay="1.6s">
              Acceder al Panel
            </ButtonComp>
          </div>
        </form>

        <div className="admin-footer">
          <p className={loaded ? "loaded" : ""}>© 2025 EasyFCT - Panel Administrativo</p>
        </div>
      </div>
    </div>
  )
}

LoginAdmin.propTypes = {
  onBack: PropTypes.func,
  logo: PropTypes.string,
}

export default LoginAdmin