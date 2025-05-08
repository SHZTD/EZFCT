"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/OfertasProfesor.css"
import { Search, Filter, ChevronRight, Calendar, Users, Briefcase } from "lucide-react"

const ProfesorOffers = () => {
  const [loaded, setLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  // Datos de ofertas
  const offers = [
    {
      id: 1,
      title: "Programmer Database",
      subtitle: "For students DAM",
      category: "programming",
      company: "TechSolutions",
      location: "Madrid",
      date: "2025-04-15",
      students: 3,
    },
    {
      id: 2,
      title: "UI Design",
      subtitle: "For students DAW",
      category: "design",
      company: "CreativeMinds",
      location: "Barcelona",
      date: "2025-04-20",
      students: 2,
    },
    {
      id: 3,
      title: "Interface Developer",
      subtitle: "For students DAW",
      category: "programming",
      company: "WebInnovate",
      location: "Valencia",
      date: "2025-05-01",
      students: 1,
    },
    {
      id: 4,
      title: "Java programmer",
      subtitle: "For students DAM",
      category: "programming",
      company: "JavaTech",
      location: "Sevilla",
      date: "2025-05-10",
      students: 4,
    },
    {
      id: 5,
      title: "Laptop Technician",
      subtitle: "For students ASIX",
      category: "hardware",
      company: "HardwarePro",
      location: "Bilbao",
      date: "2025-05-15",
      students: 2,
    },
    {
      id: 6,
      title: "Programmer Python",
      subtitle: "For students DAM",
      category: "programming",
      company: "DataScience Inc.",
      location: "Málaga",
      date: "2025-05-20",
      students: 3,
    },
  ]

  // Categorías para filtrar
  const categories = [
    { id: "all", name: "All Offers", count: offers.length },
    { id: "programming", name: "Programming", count: offers.filter((o) => o.category === "programming").length },
    { id: "design", name: "Design", count: offers.filter((o) => o.category === "design").length },
    { id: "hardware", name: "Hardware", count: offers.filter((o) => o.category === "hardware").length },
  ]

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

  return (
    <div className="profesor-offers-page-alt">
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

      <div className="offers-container-alt">
        {/* Header */}
        <header className={`page-header ${loaded ? "loaded" : ""}`}>
          <div className="header-content">
            <h1 className="page-title">Available Offers</h1>
            <p className="page-subtitle">Find and manage internship opportunities for your students</p>
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
              placeholder="Search offers by title, description or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-button">
            <Filter size={18} />
            <span>Filters</span>
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
              <h3>No offers found</h3>
              <p>Try adjusting your search or filters</p>
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
                      <span>{offer.students} students</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="view-details-button" onClick={() => handleViewOffer(offer.id)}>
                    <span>View Details</span>
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
  )
}

export default ProfesorOffers
