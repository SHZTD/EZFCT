"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  User,
  LogOut,
  ChevronDown,
  Building,
  Calendar,
  Send,
  Eye,
  X,
  Edit,
} from "lucide-react"
import "../CSS/OfertasAlumnos.css"

const OfertasAlumnos = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [appliedOffers, setAppliedOffers] = useState([])

  const [profileData, setProfileData] = useState({
    nombre: "Jaydon",
    apellido: "Herwitz",
    email: "jaydon.herwitz@example.com",
    escuela: "Ins Puig Castellar",
    edad: 17,
    competencias: "Problem Solving, Critical Thinking",
    ubicacion: "Barcelona",
    nivelTecnico: "Alto",
    habilidades: ["React", "JavaScript", "Node.js", "CSS", "HTML"],
    preferencias: ["Frontend", "Desarrollo Web", "Startups"],
  })

  const [ofertas, setOfertas] = useState([
    {
      id: 1,
      titulo: "Desarrollador Frontend React",
      empresa: "TechStart Solutions",
      ubicacion: "Madrid, España",
      tipo: "Presencial",
      duracion: "6 meses",
      descripcion:
        "Buscamos un estudiante apasionado por el desarrollo frontend para unirse a nuestro equipo de desarrollo de aplicaciones web modernas.",
      requisitos: ["React", "JavaScript", "CSS", "HTML"],
      beneficios: ["Formación continua", "Ambiente joven", "Proyectos reales"],
      fechaPublicacion: "2025-01-15",
      fechaLimite: "2025-02-15",
      matched: true,
      matchPercentage: 95,
    },
    {
      id: 2,
      titulo: "Desarrollador Full Stack",
      empresa: "InnovaCorp",
      ubicacion: "Barcelona, España",
      tipo: "Híbrido",
      duracion: "4 meses",
      descripcion: "Oportunidad única para trabajar en proyectos de e-commerce y aprender tecnologías de vanguardia.",
      requisitos: ["Node.js", "React", "MongoDB", "Express"],
      beneficios: ["Flexibilidad horaria", "Mentoring", "Certificaciones"],
      fechaPublicacion: "2025-01-10",
      fechaLimite: "2025-02-10",
      matched: true,
      matchPercentage: 87,
    },
    {
      id: 3,
      titulo: "Diseñador UI/UX",
      empresa: "Creative Studio",
      ubicacion: "Valencia, España",
      tipo: "Remoto",
      duracion: "5 meses",
      descripcion: "Únete a nuestro equipo creativo y ayuda a diseñar experiencias digitales excepcionales.",
      requisitos: ["Figma", "Adobe XD", "Photoshop", "Prototipado"],
      beneficios: ["Trabajo remoto", "Horario flexible", "Equipo internacional"],
      fechaPublicacion: "2025-01-12",
      fechaLimite: "2025-02-12",
      matched: false,
      matchPercentage: 45,
    },
    {
      id: 4,
      titulo: "Desarrollador Backend Python",
      empresa: "DataTech Labs",
      ubicacion: "Sevilla, España",
      tipo: "Presencial",
      duracion: "6 meses",
      descripcion: "Trabaja con big data y machine learning en proyectos innovadores del sector financiero.",
      requisitos: ["Python", "Django", "PostgreSQL", "Docker"],
      beneficios: ["Proyectos innovadores", "Formación en IA", "Equipo senior"],
      fechaPublicacion: "2025-01-08",
      fechaLimite: "2025-02-08",
      matched: false,
      matchPercentage: 32,
    },
    {
      id: 5,
      titulo: "Desarrollador Mobile React Native",
      empresa: "AppMakers",
      ubicacion: "Bilbao, España",
      tipo: "Híbrido",
      duracion: "5 meses",
      descripcion: "Desarrolla aplicaciones móviles innovadoras para clientes de diferentes sectores.",
      requisitos: ["React Native", "JavaScript", "Redux", "Firebase"],
      beneficios: ["Dispositivos incluidos", "Formación especializada", "Networking"],
      fechaPublicacion: "2025-01-14",
      fechaLimite: "2025-02-14",
      matched: true,
      matchPercentage: 78,
    },
  ])

  const modalRef = useRef(null)
  const profileMenuRef = useRef(null)
  const profileButtonRef = useRef(null)
  const navigate = useNavigate()

  const offersPerPage = 3
  const totalPages = Math.ceil(ofertas.length / offersPerPage)
  const startIndex = (currentPage - 1) * offersPerPage
  const currentOffers = ofertas.slice(startIndex, startIndex + offersPerPage)

  // Efecto para la animación de entrada y partículas
  useEffect(() => {
    // Marcar como cargado para iniciar animaciones
    setTimeout(() => setLoaded(true), 100)

    // Crear partículas iniciales
    createInitialParticles()

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

    // Cerrar modal al hacer clic fuera
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && (showOfferModal || showProfileModal)) {
        setShowOfferModal(false)
        setShowProfileModal(false)
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem("profileData")
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
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

    document.addEventListener("mousedown", handleClickOutsideProfileMenu)

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu)
      clearInterval(interval)
    }
  }, [showOfferModal, showProfileModal, showProfileMenu])

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

  // Función para navegar a la página de datos del alumno
  const handleNavigateToProfile = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setShowProfileMenu(false)
    setTimeout(() => navigate("/alumnos/datosAlumno"), 300)
  }

  // Función para mostrar detalles de oferta
  const handleShowOfferDetails = (offer) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    setSelectedOffer(offer)
    setShowOfferModal(true)
  }

  // Función para postularse a una oferta
  const handleApplyToOffer = (offerId) => {
    if (!appliedOffers.includes(offerId)) {
      setAppliedOffers([...appliedOffers, offerId])
      createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    }
  }

  // Función para cambiar página
  const handlePageChange = (page) => {
    setCurrentPage(page)
    createExplosionEffect(window.innerWidth / 2, 100, "#8b5cf6")
  }

  // Función para guardar los datos del perfil
  const saveProfileData = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    localStorage.setItem("profileData", JSON.stringify(profileData))
    setShowProfileModal(false)
  }

  return (
    <div className="oa-ofertas-page">
      {/* Partículas de fondo */}
      <div className="oa-particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="oa-particle"
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
        className="oa-cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Barra de navegación superior */}
      <nav className={`oa-top-navbar ${loaded ? "oa-loaded" : ""}`}>
        <div className="oa-navbar-left">
          <button className="oa-nav-button" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>
        </div>
        <div className="oa-navbar-title">
          <h2>EasyFCT</h2>
        </div>
        <div className="oa-navbar-right">
          <button ref={profileButtonRef} className="oa-user-button" onClick={handleProfileButtonClick}>
            <User size={18} />
            <span className="oa-user-name">{profileData.nombre}</span>
            <ChevronDown size={14} className={`oa-user-chevron ${showProfileMenu ? "oa-open" : ""}`} />
          </button>
        </div>
      </nav>

      <div className="oa-ofertas-container">
        {/* Header */}
        <header className={`oa-page-header ${loaded ? "oa-loaded" : ""}`}>
          <div className="oa-header-content">
            <h1 className="oa-page-title">Ofertas de Prácticas</h1>
            <p className="oa-page-subtitle">Encuentra la práctica perfecta que se adapte a tu perfil y preferencias</p>
          </div>
          <div className="oa-header-gradient"></div>
        </header>

        {/* Contenido principal */}
        <div className={`oa-ofertas-content ${loaded ? "oa-loaded" : ""}`}>
          {/* Estadísticas */}
          <div className="oa-stats-section">
            <div className="oa-stat-card">
              <div className="oa-stat-icon">
                <Briefcase size={24} />
              </div>
              <div className="oa-stat-info">
                <span className="oa-stat-number">{ofertas.length}</span>
                <span className="oa-stat-label">Ofertas Disponibles</span>
              </div>
            </div>
            <div className="oa-stat-card">
              <div className="oa-stat-icon">
                <Star size={24} />
              </div>
              <div className="oa-stat-info">
                <span className="oa-stat-number">{ofertas.filter((o) => o.matched).length}</span>
                <span className="oa-stat-label">Ofertas Recomendadas</span>
              </div>
            </div>
            <div className="oa-stat-card">
              <div className="oa-stat-icon">
                <Send size={24} />
              </div>
              <div className="oa-stat-info">
                <span className="oa-stat-number">{appliedOffers.length}</span>
                <span className="oa-stat-label">Postulaciones</span>
              </div>
            </div>
          </div>

          {/* Lista de ofertas */}
          <div className="oa-offers-section">
            <div className="oa-offers-header">
              <h2>Ofertas Personalizadas</h2>
              <p>Basadas en tus habilidades: {profileData.habilidades?.join(", ")}</p>
            </div>

            <div className="oa-offers-grid">
              {currentOffers.map((oferta) => (
                <div key={oferta.id} className={`oa-offer-card ${oferta.matched ? "oa-matched" : ""}`}>
                  {oferta.matched && (
                    <div className="oa-match-badge">
                      <Star size={14} />
                      <span>{oferta.matchPercentage}% Match</span>
                    </div>
                  )}

                  <div className="oa-offer-title-section">
                    <h3 className="oa-offer-title">{oferta.titulo}</h3>
                    <p className="oa-company-name">{oferta.empresa}</p>
                  </div>

                  <div className="oa-offer-details">
                    <div className="oa-detail-item">
                      <MapPin size={16} />
                      <span>{oferta.ubicacion}</span>
                    </div>
                    <div className="oa-detail-item">
                      <Clock size={16} />
                      <span>{oferta.duracion}</span>
                    </div>
                    <div className="oa-detail-item">
                      <Building size={16} />
                      <span>{oferta.tipo}</span>
                    </div>
                  </div>

                  <p className="oa-offer-description">{oferta.descripcion}</p>

                  <div className="oa-offer-requirements">
                    <h4>Requisitos:</h4>
                    <div className="oa-requirements-tags">
                      {oferta.requisitos.map((req, index) => (
                        <span
                          key={index}
                          className={`oa-requirement-tag ${profileData.habilidades?.includes(req) ? "oa-matched" : ""}`}
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="oa-offer-actions">
                    <button className="oa-secondary-button" onClick={() => handleShowOfferDetails(oferta)}>
                      <Eye size={16} />
                      Ver Detalles
                    </button>
                    <button
                      className={`oa-primary-button ${appliedOffers.includes(oferta.id) ? "oa-applied" : ""}`}
                      onClick={() => handleApplyToOffer(oferta.id)}
                      disabled={appliedOffers.includes(oferta.id)}
                    >
                      <Send size={16} />
                      {appliedOffers.includes(oferta.id) ? "Postulado" : "Postularse"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="oa-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`oa-page-button ${currentPage === page ? "oa-active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Menú de perfil flotante */}
        {showProfileMenu && (
          <div className="oa-fixed-profile-menu" ref={profileMenuRef}>
            <button className="oa-profile-menu-item" onClick={handleNavigateToProfile}>
              <User size={16} />
              <span>Ver perfil</span>
            </button>
            <button
              className="oa-profile-menu-item"
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
              className="oa-profile-menu-item oa-logout"
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

        {/* Modal de detalles de oferta */}
        {showOfferModal && selectedOffer && (
          <div className="oa-modal-overlay">
            <div className="oa-modal-container oa-offer-modal" ref={modalRef}>
              <div className="oa-modal-header">
                <h2 className="oa-modal-title">{selectedOffer.titulo}</h2>
                <button className="oa-close-button" onClick={() => setShowOfferModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="oa-modal-content">
                <div>
                  <h3>{selectedOffer.empresa}</h3>
                  <p>{selectedOffer.ubicacion}</p>
                </div>

                <div className="oa-modal-section">
                  <h4>Descripción</h4>
                  <p>{selectedOffer.descripcion}</p>
                </div>

                <div className="oa-modal-section">
                  <h4>Requisitos</h4>
                  <div className="oa-requirements-tags">
                    {selectedOffer.requisitos.map((req, index) => (
                      <span
                        key={index}
                        className={`oa-requirement-tag ${profileData.habilidades?.includes(req) ? "oa-matched" : ""}`}
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="oa-modal-section">
                  <h4>Beneficios</h4>
                  <ul>
                    {selectedOffer.beneficios.map((beneficio, index) => (
                      <li key={index}>{beneficio}</li>
                    ))}
                  </ul>
                </div>

                <div className="oa-modal-section">
                  <h4>Información Adicional</h4>
                  <div className="oa-modal-details-grid">
                    <div className="oa-modal-detail">
                      <Calendar size={16} />
                      <span>Duración: {selectedOffer.duracion}</span>
                    </div>
                    <div className="oa-modal-detail">
                      <Clock size={16} />
                      <span>Fecha límite: {new Date(selectedOffer.fechaLimite).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="oa-modal-footer">
                <button
                  className={`oa-primary-button ${appliedOffers.includes(selectedOffer.id) ? "oa-applied" : ""}`}
                  onClick={() => {
                    handleApplyToOffer(selectedOffer.id)
                    setShowOfferModal(false)
                  }}
                  disabled={appliedOffers.includes(selectedOffer.id)}
                >
                  <Send size={16} />
                  {appliedOffers.includes(selectedOffer.id) ? "Ya Postulado" : "Postularse Ahora"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición de perfil */}
        {showProfileModal && (
          <div className="oa-modal-overlay">
            <div className="oa-modal-container oa-profile-modal" ref={modalRef}>
              <div className="oa-modal-header">
                <h2 className="oa-modal-title">Editar Perfil</h2>
                <button className="oa-close-button" onClick={() => setShowProfileModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="oa-modal-content">
                <div className="oa-profile-form">
                  <div className="oa-profile-form-grid">
                    <div className="oa-form-group">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        value={profileData.nombre}
                        onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="apellido">Apellido</label>
                      <input
                        type="text"
                        id="apellido"
                        value={profileData.apellido}
                        onChange={(e) => setProfileData({ ...profileData, apellido: e.target.value })}
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="escuela">Escuela/Instituto</label>
                      <input
                        type="text"
                        id="escuela"
                        value={profileData.escuela}
                        onChange={(e) => setProfileData({ ...profileData, escuela: e.target.value })}
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="edad">Edad</label>
                      <input
                        type="number"
                        id="edad"
                        value={profileData.edad}
                        onChange={(e) => setProfileData({ ...profileData, edad: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="ubicacion">Ubicación</label>
                      <input
                        type="text"
                        id="ubicacion"
                        value={profileData.ubicacion}
                        onChange={(e) => setProfileData({ ...profileData, ubicacion: e.target.value })}
                      />
                    </div>
                    <div className="oa-form-group oa-full-width">
                      <label htmlFor="competencias">Competencias</label>
                      <input
                        type="text"
                        id="competencias"
                        value={profileData.competencias}
                        onChange={(e) => setProfileData({ ...profileData, competencias: e.target.value })}
                      />
                    </div>
                    <div className="oa-form-group">
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
                  </div>
                </div>
              </div>

              <div className="oa-modal-footer">
                <button className="oa-cancel-button" onClick={() => setShowProfileModal(false)}>
                  Cancelar
                </button>
                <button className="oa-save-button" onClick={saveProfileData}>
                  <Edit size={18} />
                  <span>Guardar cambios</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pie de página */}
        <footer className={`oa-page-footer ${loaded ? "oa-loaded" : ""}`}>
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </div>
    </div>
  )
}

export default OfertasAlumnos
