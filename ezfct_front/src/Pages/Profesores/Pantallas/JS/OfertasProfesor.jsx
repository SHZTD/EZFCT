"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/OfertasProfesor.css"
import {
  Search,
  HelpCircle,
  ChevronRight,
  Calendar,
  Users,
  Briefcase,
  ArrowLeft,
  User,
  LogOut,
  Edit,
  ChevronDown,
  UserPlus,
} from "lucide-react"
import { API_URL } from "../../../../constants.js"

const ProfesorOffers = () => {
  const [loaded, setLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
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
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const profileMenuRef = useRef(null)
  const profileButtonRef = useRef(null)

  // Fetch offers from API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/practicas`)
        if (!response.ok) {
          throw new Error(`¡Error HTTP! Estado: ${response.status}`)
        }
        const data = await response.json()

        // Transform API data to match frontend structure
        const transformedOffers = data.map((offer) => ({
          id: offer.idPractica,
          title: offer.titulo,
          subtitle: offer.descripcion,
          category: offer.modalidad,
          company: offer.empresa?.nombre || "Empresa Desconocida",
          location: offer.empresa?.ubicacion || "Remoto",
          date: offer.fechaInicio ? new Date(offer.fechaInicio).toLocaleDateString() : "No especificada",
          students: offer.vecesPostulada,
        }))

        setOffers(transformedOffers)
        setLoading(false)
      } catch (err) {
        console.error("Error al cargar ofertas:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  const categories = [
    { id: "all", name: "Todas las ofertas", count: offers.length },
    { id: "PRESENCIAL", name: "Presencial", count: offers.filter((o) => o.category === "PRESENCIAL").length },
    { id: "HIBRIDO", name: "Híbrido", count: offers.filter((o) => o.category === "HIBRIDO").length },
    { id: "REMOTO", name: "Remoto", count: offers.filter((o) => o.category === "REMOTO").length },
  ]

  // Rest of your existing functions remain the same...
  const handleGoBack = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    setTimeout(() => navigate(-1), 300)
  }

  const handleProfileButtonClick = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")
    setShowProfileMenu(!showProfileMenu)
  }

  const handleNavigateToCreateStudent = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setShowProfileMenu(false)
    setTimeout(() => navigate("/profesores/crearAlumno"), 300)
  }

  const saveProfileData = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    localStorage.setItem("profesorProfileData", JSON.stringify(profileData))
    setShowProfileModal(false)
  }

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

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu)
      clearInterval(interval)
    }
  }, [showProfileMenu])

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

  // Filtrar ofertas según búsqueda y categoría
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory === "all" || offer.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const handleViewOffer = (id) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    navigate(`/profesores/detalles/${id}`)
  }

  // Render loading or error states
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando ofertas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error al cargar ofertas</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Intentar de Nuevo</button>
      </div>
    )
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

      {/* Contenedor principal con el diseño original */}
      <div className="profesor-offers-page-alt">
        <div className="offers-container-alt">
          {/* Header */}
          <header className={`page-header ${loaded ? "loaded" : ""}`}>
            <div className="header-content">
              <h1 className="page-title">Ofertas Disponibles</h1>
              <p className="page-subtitle">Encuentra y gestiona oportunidades de prácticas para tus alumnos</p>
            </div>
            <div className="header-gradient"></div>
          </header>

          {/* Barra de búsqueda y filtros */}
          <div className={`search-bar-container ${loaded ? "loaded" : ""}`}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Busca ofertas por título, descripción o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-button" onClick={() => navigate("/profesores/areaContacto")}>
              <HelpCircle size={18} />
              <span>Ayuda</span>
            </button>
          </div>

          {/* Categorías */}
          <div className={`categories-container ${loaded ? "loaded" : ""}`}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
                <span className="category-count">{category.count}</span>
              </button>
            ))}
          </div>

          {/* Contenido principal */}
          <div className={`offers-grid ${loaded ? "loaded" : ""}`}>
            {filteredOffers.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No se encontraron ofertas</h3>
                <p>Intenta ajustar tu búsqueda o filtros</p>
              </div>
            ) : (
              filteredOffers.map((offer, index) => (
                <div key={offer.id} className="offer-card-alt" style={{ animationDelay: `${0.05 * index}s` }}>
                  <div className="card-content">
                    <div className="offer-header-alt">
                      <h2 className="offer-title-alt">{offer.title}</h2>
                      <span className="offer-category">{offer.category}</span>
                    </div>
                    <p className="offer-subtitle-alt">{offer.subtitle}</p>

                    <div className="offer-details-alt">
                      <div className="detail-item-alt">
                        <Briefcase size={16} />
                        <span>{offer.company}</span>
                      </div>
                      <div className="detail-item-alt">
                        <Calendar size={16} />
                        <span>{offer.date}</span>
                      </div>
                      <div className="detail-item-alt">
                        <Users size={16} />
                        <span>{offer.students} alumnos</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="view-details-button" onClick={() => handleViewOffer(offer.id)}>
                      <span>Ver Detalles</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pie de página */}
          <footer className={`page-footer ${loaded ? "loaded" : ""}`}>
            <p>© 2025 EasyFCT - Innovación Educativa</p>
          </footer>
        </div>
      </div>

      {/* Menú de perfil flotante */}
      {showProfileMenu && (
        <div className="fixed-profile-menu" ref={profileMenuRef}>
          <button className="profile-menu-item" onClick={handleNavigateToCreateStudent}>
            <UserPlus size={16} />
            <span>Crear Alumno</span>
          </button>
          <button
            className="profile-menu-item"
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
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-container profile-modal">
            <div className="modal-header">
              <h2 className="modal-title">Editar Perfil</h2>
              <button className="close-button" onClick={() => setShowProfileModal(false)}>
                ×
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

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowProfileModal(false)}>
                Cancelar
              </button>
              <button className="save-button" onClick={saveProfileData}>
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

export default ProfesorOffers