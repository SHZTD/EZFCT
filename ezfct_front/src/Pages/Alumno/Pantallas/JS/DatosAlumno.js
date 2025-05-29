import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  User,
  LogOut,
  Edit,
  ChevronDown,
  Mail,
  MapPin,
  School,
  BookOpen,
  Briefcase,
  Save,
  X,
  FileText,
  Star,
  BarChart,
  Zap,
} from "lucide-react"
import "../CSS/DatosAlumno.css"

const DatosAlumno = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [profileData, setProfileData] = useState({
    nombre: "Jaydon",
    apellido: "Herwitz",
    email: "jaydon.herwitz@example.com",
    escuela: "Ins Puig Castellar",
    edad: 17,
    competencias: "Problem Solving, Critical Thinking, JavaScript, React, HTML, CSS",
    ubicacion: "Barcelona",
    nivelTecnico: "Alto",
    ciclo: "Desarrollo de Aplicaciones Web",
    curso: "2º Curso",
    empresa: "TechSolutions Barcelona",
    horasTotales: 380,
    horasCompletadas: 120,
    fechaInicio: "2025-01-15",
    fechaFin: "2025-05-30",
    tutor: "Maria García",
    tutorEmail: "maria.garcia@techsolutions.com",
    descripcion:
      "Estudiante de desarrollo web con gran interés en tecnologías frontend. Busco oportunidades para aplicar mis conocimientos en React y mejorar mis habilidades en un entorno profesional.",
    proyectos: [
      {
        nombre: "Aplicación de gestión de tareas",
        descripcion: "Desarrollo de una aplicación web para gestionar tareas y proyectos del equipo.",
        tecnologias: "React, Node.js, MongoDB",
      },
      {
        nombre: "Rediseño de la página web corporativa",
        descripcion: "Colaboración en el rediseño y desarrollo de la nueva web responsive de la empresa.",
        tecnologias: "HTML, CSS, JavaScript, Figma",
      },
    ],
    evaluaciones: [
      {
        fecha: "2025-02-15",
        puntuacion: 4.5,
        comentario: "Excelente progreso en el desarrollo frontend. Muestra iniciativa y capacidad de aprendizaje.",
      },
      {
        fecha: "2025-03-30",
        puntuacion: 4.8,
        comentario:
          "Ha mejorado significativamente en trabajo en equipo. Sus contribuciones al proyecto de rediseño han sido muy valiosas.",
      },
    ],
  })

  const profileMenuRef = useRef(null)
  const profileButtonRef = useRef(null)
  const modalRef = useRef(null)
  const navigate = useNavigate()

  // Efecto para la animación de entrada y partículas
  useEffect(() => {
    // Marcar como cargado para iniciar animaciones
    setTimeout(() => setLoaded(true), 100)

    // Crear partículas iniciales
    createInitialParticles()

    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem("profileData")
    if (savedProfile) {
      setProfileData({ ...profileData, ...JSON.parse(savedProfile) })
    }

    // Seguimiento del ratón
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.pageX, y: e.pageY })
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

    // Cerrar modal al hacer clic fuera
    const handleClickOutsideModal = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && showEditModal) {
        setShowEditModal(false)
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutsideProfileMenu)
    document.addEventListener("mousedown", handleClickOutsideModal)

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu)
      document.removeEventListener("mousedown", handleClickOutsideModal)
      clearInterval(interval)
    }
  }, [showProfileMenu, showEditModal])

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

  const handleGoBack = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e")
    setTimeout(() => navigate(-1), 300)
  }

  // Función para manejar el clic en el botón de perfil
  const handleProfileButtonClick = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")
    setShowProfileMenu(!showProfileMenu)
  }

  // Función para navegar al diario
  const handleNavigateToDiary = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setShowProfileMenu(false)
    setTimeout(() => navigate("/alumnos/diario"), 300)
  }

  // Función para guardar los datos del perfil
  const saveProfileData = () => {
    setIsSaving(true)
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")

    // Simular guardado
    setTimeout(() => {
      // Guardar en localStorage
      localStorage.setItem("profileData", JSON.stringify(profileData))

      setIsSaving(false)
      setShowEditModal(false)
    }, 800)
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Calcular el progreso de las prácticas
  const progressPercentage = Math.round((profileData.horasCompletadas / profileData.horasTotales) * 100)

  // Función para renderizar estrellas basadas en puntuación
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="star-icon filled" size={16} fill="#f59e0b" color="#f59e0b" />)
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half-star" className="star-icon half-filled" size={16} fill="url(#halfGradient)" color="#f59e0b" />,
      )
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="star-icon empty" size={16} fill="transparent" color="#f59e0b" />,
      )
    }

    return (
      <div className="stars-container">
        <svg width="0" height="0">
          <defs>
            <linearGradient id="halfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        {stars}
      </div>
    )
  }

  return (
    <div className="perfil-page">
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

      {/* Efecto de luz que sigue al cursor */}
      <div
        className="cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Barra de navegación superior */}
      <nav className={`top-navbar ${loaded ? "loaded" : ""}`}>
        <div className="navbar-left">
          <button className="nav-button" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>
        </div>
        <div className="navbar-title">
          <h2>EasyFCT</h2>
        </div>
        <div className="navbar-right">
          <button ref={profileButtonRef} className="user-button" onClick={handleProfileButtonClick}>
            <User size={18} />
            <span className="user-name">{profileData.nombre}</span>
            <ChevronDown size={14} className={`user-chevron ${showProfileMenu ? "open" : ""}`} />
          </button>
        </div>
      </nav>

      <div className="perfil-container">
        {/* Header */}
        <header className={`page-header ${loaded ? "loaded" : ""}`}>
          <div className="header-content">
            <h1 className="page-title">Mi Perfil</h1>
            <p className="page-subtitle">Información personal y seguimiento de prácticas</p>
          </div>
          <div className="header-gradient"></div>
        </header>

        {/* Contenido principal */}
        <div className={`perfil-content ${loaded ? "loaded" : ""}`}>
          {/* Tarjeta de perfil */}
          <div className="perfil-card">
            <div className="perfil-header">
              <div className="perfil-avatar">
                <span>
                  {profileData.nombre.charAt(0)}
                  {profileData.apellido.charAt(0)}
                </span>
              </div>
              <div className="perfil-info">
                <h2 className="perfil-name">
                  {profileData.nombre} {profileData.apellido}
                </h2>
                <p className="perfil-role">{profileData.ciclo}</p>
                <div className="perfil-details">
                  <div className="perfil-detail">
                    <Mail size={14} />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="perfil-detail">
                    <MapPin size={14} />
                    <span>{profileData.ubicacion}</span>
                  </div>
                  <div className="perfil-detail">
                    <School size={14} />
                    <span>{profileData.escuela}</span>
                  </div>
                </div>
              </div>
              <button
                className="edit-profile-button"
                onClick={() => {
                  createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")
                  setShowEditModal(true)
                }}
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>
            </div>

            <div className="perfil-tabs">
              <button
                className={`perfil-tab ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                <User size={16} />
                <span>Información</span>
              </button>
              <button
                className={`perfil-tab ${activeTab === "practicas" ? "active" : ""}`}
                onClick={() => setActiveTab("practicas")}
              >
                <Briefcase size={16} />
                <span>Prácticas</span>
              </button>
              <button
                className={`perfil-tab ${activeTab === "proyectos" ? "active" : ""}`}
                onClick={() => setActiveTab("proyectos")}
              >
                <FileText size={16} />
                <span>Proyectos</span>
              </button>
              <button
                className={`perfil-tab ${activeTab === "evaluaciones" ? "active" : ""}`}
                onClick={() => setActiveTab("evaluaciones")}
              >
                <BarChart size={16} />
                <span>Evaluaciones</span>
              </button>
            </div>

            <div className="perfil-content-area">
              {/* Pestaña de Información */}
              {activeTab === "info" && (
                <div className="tab-content info-tab">
                  <div className="info-section">
                    <h3 className="section-title">Sobre mí</h3>
                    <p className="info-description">{profileData.descripcion}</p>
                  </div>

                  <div className="info-section">
                    <h3 className="section-title">Datos académicos</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Ciclo formativo</span>
                        <span className="info-value">{profileData.ciclo}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Curso actual</span>
                        <span className="info-value">{profileData.curso}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Centro educativo</span>
                        <span className="info-value">{profileData.escuela}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Edad</span>
                        <span className="info-value">{profileData.edad} años</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3 className="section-title">Competencias</h3>
                    <div className="skills-container">
                      {profileData.competencias.split(",").map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pestaña de Prácticas */}
              {activeTab === "practicas" && (
                <div className="tab-content practicas-tab">
                  <div className="info-section">
                    <h3 className="section-title">Empresa de prácticas</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Nombre de la empresa</span>
                        <span className="info-value">{profileData.empresa}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Tutor/a</span>
                        <span className="info-value">{profileData.tutor}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Email del tutor</span>
                        <span className="info-value">{profileData.tutorEmail}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Nivel técnico</span>
                        <span className="info-value">{profileData.nivelTecnico}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3 className="section-title">Periodo de prácticas</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Fecha de inicio</span>
                        <span className="info-value">{formatDate(profileData.fechaInicio)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Fecha de finalización</span>
                        <span className="info-value">{formatDate(profileData.fechaFin)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Horas totales</span>
                        <span className="info-value">{profileData.horasTotales} horas</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Horas completadas</span>
                        <span className="info-value">{profileData.horasCompletadas} horas</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3 className="section-title">Progreso</h3>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                      <div className="progress-stats">
                        <span className="progress-percentage">{progressPercentage}% completado</span>
                        <span className="progress-hours">
                          {profileData.horasCompletadas} de {profileData.horasTotales} horas
                        </span>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button className="action-button diary-button" onClick={handleNavigateToDiary}>
                        <BookOpen size={16} />
                        <span>Ir al diario de prácticas</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pestaña de Proyectos */}
              {activeTab === "proyectos" && (
                <div className="tab-content proyectos-tab">
                  <div className="info-section">
                    <h3 className="section-title">Proyectos realizados</h3>
                    <div className="projects-list">
                      {profileData.proyectos.map((proyecto, index) => (
                        <div key={index} className="project-card">
                          <h4 className="project-title">{proyecto.nombre}</h4>
                          <p className="project-description">{proyecto.descripcion}</p>
                          <div className="project-tech">
                            <span className="tech-label">Tecnologías:</span>
                            <div className="tech-tags">
                              {proyecto.tecnologias.split(",").map((tech, techIndex) => (
                                <span key={techIndex} className="tech-tag">
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="info-section">
                    <h3 className="section-title">Añadir nuevo proyecto</h3>
                    <div className="add-project-placeholder">
                      <Zap size={24} />
                      <p>
                        Puedes añadir nuevos proyectos realizados durante tus prácticas para mantener un portafolio
                        actualizado.
                      </p>
                      <button className="add-project-button">
                        <span>Añadir proyecto</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pestaña de Evaluaciones */}
              {activeTab === "evaluaciones" && (
                <div className="tab-content evaluaciones-tab">
                  <div className="info-section">
                    <h3 className="section-title">Evaluaciones del tutor</h3>
                    <div className="evaluations-list">
                      {profileData.evaluaciones.map((evaluacion, index) => (
                        <div key={index} className="evaluation-card">
                          <div className="evaluation-header">
                            <div className="evaluation-date">{formatDate(evaluacion.fecha)}</div>
                            <div className="evaluation-rating">
                              {renderStars(evaluacion.puntuacion)}
                              <span className="rating-value">{evaluacion.puntuacion.toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="evaluation-comment">{evaluacion.comentario}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="info-section">
                    <h3 className="section-title">Resumen de evaluaciones</h3>
                    <div className="evaluation-summary">
                      <div className="summary-item">
                        <span className="summary-label">Evaluaciones recibidas</span>
                        <span className="summary-value">{profileData.evaluaciones.length}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Puntuación media</span>
                        <div className="summary-rating">
                          {renderStars(
                            profileData.evaluaciones.reduce((acc, curr) => acc + curr.puntuacion, 0) /
                              profileData.evaluaciones.length,
                          )}
                          <span className="rating-value">
                            {(
                              profileData.evaluaciones.reduce((acc, curr) => acc + curr.puntuacion, 0) /
                              profileData.evaluaciones.length
                            ).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menú de perfil flotante */}
        {showProfileMenu && (
          <div className="fixed-profile-menu" ref={profileMenuRef}>
            <button className="profile-menu-item active">
              <User size={16} />
              <span>Ver perfil</span>
            </button>
            <button className="profile-menu-item" onClick={handleNavigateToDiary}>
              <BookOpen size={16} />
              <span>Ir al diario</span>
            </button>
            <button
              className="profile-menu-item"
              onClick={() => {
                createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
                setShowProfileMenu(false)
                setShowEditModal(true)
              }}
            >
              <Edit size={16} />
              <span>Editar perfil</span>
            </button>
            <button
              className="profile-menu-item logout"
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
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-container profile-modal" ref={modalRef}>
              <div className="modal-header">
                <h2 className="modal-title">Editar Perfil</h2>
                <button className="close-button" onClick={() => setShowEditModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-content">
                <div className="profile-form">
                  <div className="profile-form-grid">
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
                      <label htmlFor="escuela">Escuela/Instituto</label>
                      <input
                        type="text"
                        id="escuela"
                        value={profileData.escuela}
                        onChange={(e) => setProfileData({ ...profileData, escuela: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edad">Edad</label>
                      <input
                        type="number"
                        id="edad"
                        value={profileData.edad}
                        onChange={(e) => setProfileData({ ...profileData, edad: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ubicacion">Ubicación</label>
                      <input
                        type="text"
                        id="ubicacion"
                        value={profileData.ubicacion}
                        onChange={(e) => setProfileData({ ...profileData, ubicacion: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ciclo">Ciclo formativo</label>
                      <input
                        type="text"
                        id="ciclo"
                        value={profileData.ciclo}
                        onChange={(e) => setProfileData({ ...profileData, ciclo: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="curso">Curso actual</label>
                      <input
                        type="text"
                        id="curso"
                        value={profileData.curso}
                        onChange={(e) => setProfileData({ ...profileData, curso: e.target.value })}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="competencias">Competencias (separadas por comas)</label>
                      <input
                        type="text"
                        id="competencias"
                        value={profileData.competencias}
                        onChange={(e) => setProfileData({ ...profileData, competencias: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="nivelTecnico">Nivel técnico</label>
                      <select
                        id="nivelTecnico"
                        value={profileData.nivelTecnico}
                        onChange={(e) => setProfileData({ ...profileData, nivelTecnico: e.target.value })}
                      >
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="descripcion">Descripción personal</label>
                      <textarea
                        id="descripcion"
                        rows={4}
                        value={profileData.descripcion}
                        onChange={(e) => setProfileData({ ...profileData, descripcion: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-button" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button className="save-button" onClick={saveProfileData} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <span className="spinner"></span>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Guardar cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pie de página */}
        <footer className={`page-footer ${loaded ? "loaded" : ""}`}>
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </div>
    </div>
  )
}

export default DatosAlumno
