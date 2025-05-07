"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/CreacionOfertas.css"

// Importamos las imágenes
import paperIcon from "../../../Imagenes/paper.png"
import usersIcon from "../../../Imagenes/users.png"
import questionIcon from "../../../Imagenes/question.png"
import logo from "../../../Imagenes/logo.gif"

const OfertasPage = () => {
  const [activeTab, setActiveTab] = useState("offers")
  const [isLoading, setIsLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    startDate: "",
    endDate: "",
    modality: "presencial",
    vacancies: "1",
  })

  // Estado para las ofertas publicadas (simuladas)
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      description:
        "We are looking for a skilled frontend developer with experience in React and modern CSS frameworks.",
      skills: "React, JavaScript, CSS, HTML",
      startDate: "2025-04-01",
      endDate: "2025-06-30",
      modality: "híbrido",
      vacancies: "2",
      date: "2025-03-15",
      applications: 12,
      status: "active",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      description: "Join our creative team to design beautiful and functional user interfaces for our products.",
      skills: "Figma, Adobe XD, UI/UX, Prototyping",
      startDate: "2025-05-15",
      endDate: "2025-08-15",
      modality: "presencial",
      vacancies: "1",
      date: "2025-03-10",
      applications: 8,
      status: "active",
    },
    {
      id: 3,
      title: "Backend Developer",
      description: "Develop and maintain server-side applications using Node.js and Express.",
      skills: "Node.js, Express, MongoDB, API Design",
      startDate: "2025-04-15",
      endDate: "2025-07-15",
      modality: "remota",
      vacancies: "3",
      date: "2025-03-05",
      applications: 15,
      status: "active",
    },
  ])

  const navigate = useNavigate()

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

  const navigateTo = (route) => {
    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f59e0b")
    setTimeout(() => {
      navigate(`/${route}`)
    }, 300)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const publishOffer = () => {
    // Validar que todos los campos estén completos
    if (!formData.title || !formData.description || !formData.skills || !formData.startDate || !formData.endDate) {
      // Efecto de vibración si faltan campos
      document.querySelector(".form-card").classList.add("shake")
      setTimeout(() => {
        document.querySelector(".form-card").classList.remove("shake")
      }, 500)
      return
    }

    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")

    setIsLoading(true)
    setTimeout(() => {
      // Añadir la nueva oferta al estado
      const newOffer = {
        id: offers.length + 1,
        ...formData,
        date: new Date().toISOString().split("T")[0],
        applications: 0,
        status: "active",
      }

      setOffers([newOffer, ...offers])

      // Resetear el formulario
      setFormData({
        title: "",
        description: "",
        skills: "",
        startDate: "",
        endDate: "",
        modality: "presencial",
        vacancies: "1",
      })

      setIsLoading(false)

      // Mostrar efecto de éxito
      createExplosionEffect(window.innerWidth / 2, window.innerHeight / 2, "#10b981")
    }, 1500)
  }

  // Función para eliminar una oferta
  const deleteOffer = (id) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#ef4444")
    setOffers(offers.filter((offer) => offer.id !== id))
  }

  // Función para pausar/activar una oferta
  const toggleOfferStatus = (id) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f59e0b")
    setOffers(
      offers.map((offer) =>
        offer.id === id ? { ...offer, status: offer.status === "active" ? "paused" : "active" } : offer,
      ),
    )
  }

  // Función para obtener el color de la modalidad
  const getModalityColor = (modality) => {
    switch (modality.toLowerCase()) {
      case "presencial":
        return "#10b981" // verde
      case "remota":
        return "#3b82f6" // azul
      case "híbrido":
      case "hibrido":
        return "#8b5cf6" // púrpura
      default:
        return "#f59e0b" // naranja
    }
  }

  // Función para obtener el icono de la modalidad
  const getModalityIcon = (modality) => {
    switch (modality.toLowerCase()) {
      case "presencial":
        return "🏢"
      case "remota":
        return "🏠"
      case "híbrido":
      case "hibrido":
        return "🔄"
      default:
        return "📍"
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Publicando . . .</p>
        </div>
      </div>
    )
  }

  return (
    <div className="offers-page">
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

      <div className="offers-container">
        {/* Header con logo */}
        <div className={`offers-header ${loaded ? "loaded" : ""}`}>
          <div className="decorative-circle circle-1"></div>
          <div className="decorative-circle circle-2"></div>

          <div className={`logo-container ${loaded ? "loaded" : ""}`}>
            <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
          </div>

          <h1 className={`title ${loaded ? "loaded" : ""}`}>OFFERS</h1>
          <div className={`divider ${loaded ? "loaded" : ""}`}></div>
          <p className={`subtitle ${loaded ? "loaded" : ""}`}>Create and manage your job offers</p>
        </div>

        {/* Navigation Tabs */}
        <div className={`nav-tabs ${loaded ? "loaded" : ""}`}>
          <button
            className={`tab-button ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            <img src={paperIcon || "/placeholder.svg"} alt="Offers" className="tab-icon" />
            <span>Offers</span>
          </button>
          <button
            className={`tab-button ${activeTab === "students" ? "active" : ""}`}
            onClick={() => navigateTo("empresas/Estudiantes")}
          >
            <img src={usersIcon || "/placeholder.svg"} alt="Students" className="tab-icon" />
            <span>Students</span>
          </button>
          <button
            className={`tab-button ${activeTab === "help" ? "active" : ""}`}
            onClick={() => navigateTo("empresas/HelpEmpresa")}
          >
            <img src={questionIcon || "/placeholder.svg"} alt="Help" className="tab-icon" />
            <span>Help</span>
          </button>
        </div>

        {/* Contenido principal con dos columnas */}
        <div className="main-content">
          <div className="split-layout">
            {/* Columna izquierda: Creación de ofertas */}
            <div className="split-column create-column">
              <div className="slide-content">
                <h2 className="section-title">
                  <span className="section-icon">✏️</span>
                  Create New Offer
                </h2>
                <div className="form-content">
                  <div className={`form-card ${loaded ? "loaded" : ""}`}>
                    <div className={`form-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.3s" }}>
                      <div className="input-container">
                        <label htmlFor="title">Title of Offer</label>
                        <div className="input-wrapper">
                          <span className="input-icon">📝</span>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            className="custom-input"
                            placeholder="Enter the title of your offer"
                            value={formData.title}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={`form-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.4s" }}>
                      <div className="textarea-container">
                        <label htmlFor="description">Description</label>
                        <div className="input-wrapper">
                          <span className="input-icon textarea-icon">📄</span>
                          <textarea
                            id="description"
                            name="description"
                            className="custom-textarea"
                            placeholder="Describe the offer in detail"
                            rows="4"
                            value={formData.description}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className={`form-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.5s" }}>
                      <div className="input-container">
                        <label htmlFor="skills">Skills Required</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🔧</span>
                          <input
                            type="text"
                            id="skills"
                            name="skills"
                            className="custom-input"
                            placeholder="e.g. JavaScript, React, CSS"
                            value={formData.skills}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fechas de inicio y fin */}
                    <div className={`form-group date-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.6s" }}>
                      <div className="date-inputs">
                        <div className="input-container">
                          <label htmlFor="startDate">Start Date</label>
                          <div className="input-wrapper">
                            <span className="input-icon">📅</span>
                            <input
                              type="date"
                              id="startDate"
                              name="startDate"
                              className="custom-input date-input"
                              value={formData.startDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="input-container">
                          <label htmlFor="endDate">End Date</label>
                          <div className="input-wrapper">
                            <span className="input-icon">📅</span>
                            <input
                              type="date"
                              id="endDate"
                              name="endDate"
                              className="custom-input date-input"
                              value={formData.endDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campo de modalidad */}
                    <div className={`form-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.7s" }}>
                      <div className="select-container">
                        <label htmlFor="modality">Modality</label>
                        <div className="input-wrapper">
                          <span className="input-icon">🌐</span>
                          <select
                            id="modality"
                            name="modality"
                            className="custom-select"
                            value={formData.modality}
                            onChange={handleInputChange}
                          >
                            <option value="presencial">Presencial</option>
                            <option value="remota">Remota</option>
                            <option value="híbrido">Híbrido</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className={`form-group ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.8s" }}>
                      <div className="select-container">
                        <label htmlFor="vacancies">Vacancies</label>
                        <div className="input-wrapper">
                          <span className="input-icon">👥</span>
                          <select
                            id="vacancies"
                            name="vacancies"
                            className="custom-select"
                            value={formData.vacancies}
                            onChange={handleInputChange}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className={`button-container ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.9s" }}>
                      <button className="publish-button" onClick={publishOffer}>
                        <span className="button-icon">✈️</span>
                        Publish Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Visualización de ofertas */}
            <div className="split-column view-column">
              <div className="slide-content">
                <div className={`offers-list-header ${loaded ? "loaded" : ""}`}>
                  <h2 className="section-title">
                    <span className="section-icon">👁️</span>
                    Your Published Offers
                  </h2>
                  <div className="offers-stats">
                    <div className="stat-item">
                      <span className="stat-value">{offers.length}</span>
                      <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{offers.filter((o) => o.status === "active").length}</span>
                      <span className="stat-label">Active</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">
                        {offers.reduce((acc, curr) => acc + Number.parseInt(curr.applications || 0), 0)}
                      </span>
                      <span className="stat-label">Applications</span>
                    </div>
                  </div>
                </div>

                {offers.length === 0 ? (
                  <div className="no-offers">
                    <div className="no-offers-icon">📭</div>
                    <h3>No offers published yet</h3>
                    <p>Create your first job offer to start receiving applications</p>
                  </div>
                ) : (
                  <div className="offers-list">
                    {offers.map((offer, index) => (
                      <div
                        key={offer.id}
                        className={`offer-card ${offer.status !== "active" ? "paused" : ""}`}
                        style={{
                          animationDelay: `${0.1 + index * 0.05}s`,
                          transitionDelay: `${0.1 + index * 0.05}s`,
                        }}
                      >
                        <div className="offer-header">
                          <h3 className="offer-title">{offer.title}</h3>
                          <div className="offer-badges">
                            <span className={`status-badge ${offer.status}`}>
                              {offer.status === "active" ? "Active" : "Paused"}
                            </span>
                            <span className="date-badge">{offer.date}</span>
                          </div>
                        </div>

                        <div className="offer-description">
                          <p>{offer.description}</p>
                        </div>

                        <div className="offer-details">
                          <div className="detail-item">
                            <span className="detail-icon">🔧</span>
                            <span className="detail-text">{offer.skills}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <span className="detail-text">
                              {offer.startDate} to {offer.endDate}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">{getModalityIcon(offer.modality)}</span>
                            <span 
                              className="detail-text modality-badge"
                              style={{
                                backgroundColor: `${getModalityColor(offer.modality)}20`,
                                color: getModalityColor(offer.modality)
                              }}
                            >
                              {offer.modality}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">👥</span>
                            <span className="detail-text">
                              {offer.vacancies} {Number.parseInt(offer.vacancies) === 1 ? "vacancy" : "vacancies"}
                            </span>
                          </div>
                        </div>

                        <div className="offer-stats">
                          <div className="stat">
                            <span className="stat-number">{offer.applications}</span>
                            <span className="stat-label">Applications</span>
                          </div>
                        </div>

                        <div className="offer-actions">
                          <button
                            className="action-button view"
                            onClick={() => createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")}
                          >
                            <span className="action-icon">👁️</span>
                            View Details
                          </button>
                          <button className="action-button toggle" onClick={() => toggleOfferStatus(offer.id)}>
                            <span className="action-icon">{offer.status === "active" ? "⏸️" : "▶️"}</span>
                            {offer.status === "active" ? "Pause" : "Activate"}
                          </button>
                          <button className="action-button delete" onClick={() => deleteOffer(offer.id)}>
                            <span className="action-icon">🗑️</span>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <p className={loaded ? "loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  )
}

export default OfertasPage
