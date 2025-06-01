"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, X, User, LogOut, Edit, ChevronDown, Search } from "lucide-react"
import "../CSS/CrearAlumno.css"
import { API_URL } from "../../../../constants"

const CrearAlumno = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({
    nombre: "Prof. García",
    apellido: "Martínez",
    email: "garcia.martinez@instituto.edu",
    instituto: "Ins Puig Castellar",
    departamento: "Informática",
    experiencia: "15 años",
    especialidad: "Desarrollo Web",
  })
  const navigate = useNavigate()
  const profileMenuRef = useRef(null)
  const profileButtonRef = useRef(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Cerrar menú de perfil al hacer clic fuera
    const handleClickOutsideProfileMenu = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target) &&
        showProfileMenu
      ) {
        setShowProfileMenu(false)
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutsideProfileMenu)

    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem("profesorProfileData")
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu)
      clearInterval(interval)
    }
  }, [showProfileMenu])

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

  const handleProfileButtonClick = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")
    setShowProfileMenu(!showProfileMenu)
  }

  const handleNavigateToOffers = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setShowProfileMenu(false)
    setTimeout(() => navigate("/profesores/Ofertas"), 300)
  }

  const saveProfileData = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    localStorage.setItem("profesorProfileData", JSON.stringify(profileData))
    setShowProfileModal(false)
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
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        departamento: "",
        rol: "ALUMNO",
      }

      const response = await fetch(`${API_URL}/auth/registeruser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Usuario creado:", result)

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
    })
    setMessage({ type: "", text: "" })
  }

  return (
    <>
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

      {/* Barra de navegación superior */}
      <nav className={`ca-top-navbar ${loaded ? "loaded" : ""}`}>
        <div className="ca-navbar-left">
          <button className="ca-nav-button" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>
        </div>
        <div className="ca-navbar-title">
          <h2>EasyFCT</h2>
        </div>
        <div className="ca-navbar-right">
          <button ref={profileButtonRef} className="ca-user-button" onClick={handleProfileButtonClick}>
            <User size={18} />
            <span className="ca-user-name">{profileData.nombre}</span>
            <ChevronDown size={14} className={`ca-user-chevron ${showProfileMenu ? "open" : ""}`} />
          </button>
        </div>
      </nav>

      <div className="crear-alumno-page">
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

                <div className="form-group full-width">
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

      {/* Menú de perfil flotante */}
      {showProfileMenu && (
        <div className="ca-fixed-profile-menu" ref={profileMenuRef}>
          <button className="ca-profile-menu-item" onClick={handleNavigateToOffers}>
            <Search size={16} />
            <span>Ver Ofertas</span>
          </button>
          <button
            className="ca-profile-menu-item"
            onClick={() => {
              createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
              setShowProfileMenu(false)
              setShowProfileModal(true)
            }}
          >
            <Edit size={16} />
            <span>Editar perfil</span>
          </button>
          <button
            className="ca-profile-menu-item logout"
            onClick={() => {
              createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e")
              setTimeout(() => navigate("/"), 300)
            }}
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}

      {/* Modal de edición de perfil */}
      {showProfileModal && (
        <div className="ca-modal-overlay">
          <div className="ca-modal-container profile-modal">
            <div className="ca-modal-header">
              <h2 className="ca-modal-title">Editar Perfil</h2>
              <button className="ca-close-button" onClick={() => setShowProfileModal(false)}>
                ×
              </button>
            </div>

            <div className="ca-modal-content">
              <div className="ca-profile-form">
                <div className="ca-profile-form-grid">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      value={profileData.nombre}
                      onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                      type="text"
                      id="apellido"
                      value={profileData.apellido}
                      onChange={(e) => setProfileData({ ...profileData, apellido: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="instituto">Instituto</label>
                    <input
                      type="text"
                      id="instituto"
                      value={profileData.instituto}
                      onChange={(e) => setProfileData({ ...profileData, instituto: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="departamento">Departamento</label>
                    <input
                      type="text"
                      id="departamento"
                      value={profileData.departamento}
                      onChange={(e) => setProfileData({ ...profileData, departamento: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="experiencia">Experiencia</label>
                    <input
                      type="text"
                      id="experiencia"
                      value={profileData.experiencia}
                      onChange={(e) => setProfileData({ ...profileData, experiencia: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="especialidad">Especialidad</label>
                    <input
                      type="text"
                      id="especialidad"
                      value={profileData.especialidad}
                      onChange={(e) => setProfileData({ ...profileData, especialidad: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="ca-modal-footer">
              <button className="ca-cancel-button" onClick={() => setShowProfileModal(false)}>
                Cancelar
              </button>
              <button className="ca-save-button" onClick={saveProfileData}>
                <Edit size={18} />
                <span>Guardar cambios</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CrearAlumno
