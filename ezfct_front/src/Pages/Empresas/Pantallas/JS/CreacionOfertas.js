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

  // 
  const publishOffer = () => {
    // Validar que todos los campos estén completos
    if (!formData.title || !formData.description || !formData.skills || !formData.startDate || !formData.endDate) {
      // Efecto de vibración si faltan campos
      document.querySelector(".empresa-form-card").classList.add("empresa-shake")
      setTimeout(() => {
        document.querySelector(".empresa-form-card").classList.remove("empresa-shake")
      }, 500)
      return
    }

    // vale guay, 15/05/2025 - Thomas
    // he añadido un post en la api para ver si rula o no

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
      <div className="empresa-loading-screen">
        <div className="empresa-loading-container">
          <div className="empresa-spinner"></div>
          <p>Publicando . . .</p>
        </div>
      </div>
    )
  }

  return (
    <div className="empresa-offers-page">
      {/* Partículas de fondo */}
      <div className="empresa-particles-container">
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

      <div className="empresa-offers-container">
        {/* Header con logo */}
        <div className={`empresa-offers-header ${loaded ? "empresa-loaded" : ""}`}>
          <div className="empresa-decorative-circle empresa-circle-1"></div>
          <div className="empresa-decorative-circle empresa-circle-2"></div>

          <div className={`empresa-logo-container ${loaded ? "empresa-loaded" : ""}`}>
            <img src={logo || "/placeholder.svg"} alt="Logo" className="empresa-logo" />
          </div>

          <h1 className={`empresa-title ${loaded ? "empresa-loaded" : ""}`}>OFFERS</h1>
          <div className={`empresa-divider ${loaded ? "empresa-loaded" : ""}`}></div>
          <p className={`empresa-subtitle ${loaded ? "empresa-loaded" : ""}`}>Create and manage your job offers</p>
        </div>

        {/* Navigation Tabs */}
        <div className={`empresa-nav-tabs ${loaded ? "empresa-loaded" : ""}`}>
          <button
            className={`empresa-tab-button ${activeTab === "offers" ? "empresa-active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            <img src={paperIcon || "/placeholder.svg"} alt="Offers" className="empresa-tab-icon" />
            <span>Offers</span>
          </button>
          <button
            className={`empresa-tab-button ${activeTab === "students" ? "empresa-active" : ""}`}
            onClick={() => navigateTo("empresas/Estudiantes")}
          >
            <img src={usersIcon || "/placeholder.svg"} alt="Students" className="empresa-tab-icon" />
            <span>Students</span>
          </button>
          <button
            className={`empresa-tab-button ${activeTab === "help" ? "empresa-active" : ""}`}
            onClick={() => navigateTo("empresas/HelpEmpresa")}
          >
            <img src={questionIcon || "/placeholder.svg"} alt="Help" className="empresa-tab-icon" />
            <span>Help</span>
          </button>
        </div>

        {/* Contenido principal con dos columnas */}
        <div className="empresa-main-content">
          <div className="empresa-split-layout">
            {/* Columna izquierda: Creación de ofertas */}
            <div className="empresa-split-column empresa-create-column">
              <div className="empresa-slide-content">
                <h2 className="empresa-section-title">
                  <span className="empresa-section-icon">✏️</span>
                  Create New Offer
                </h2>
                <div className="empresa-form-content">
                  <div className={`empresa-form-card ${loaded ? "empresa-loaded" : ""}`}>
                    <div
                      className={`empresa-form-group ${loaded ? "empresa-loaded" : ""}`}
                      style={{ transitionDelay: "0.3s" }}
                    >
                      <div className="empresa-input-container">
                        <label htmlFor="title">Title of Offer</label>
                        <div className="empresa-input-wrapper">
                          <span className="empresa-input-icon">📝</span>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            className="empresa-custom-input"
                            placeholder="Enter the title of your offer"
                            value={formData.title}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`empresa-form-group ${loaded ? "empresa-loaded" : ""}`}
                      style={{ transitionDelay: "0.4s" }}
                    >
                      <div className="empresa-textarea-container">
                        <label htmlFor="description">Description</label>
                        <div className="empresa-input-wrapper">
                          <span className="empresa-input-icon empresa-textarea-icon">📄</span>
                          <textarea
                            id="description"
                            name="description"
                            className="empresa-custom-textarea"
                            placeholder="Describe the offer in detail"
                            rows="4"
                            value={formData.description}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`empresa-form-group ${loaded ? "empresa-loaded" : ""}`}
                      style={{ transitionDelay: "0.5s" }}
                    >
                      <div className="empresa-input-container">
                        <label htmlFor="skills">Skills Required</label>
                        <div className="empresa-input-wrapper">
                          <span className="empresa-input-icon">🔧</span>
                          <input
                            type="text"
                            id="skills"
                            name="skills"
                            className="empresa-custom-input"
                            placeholder="e.g. JavaScript, React, CSS"
                            value={formData.skills}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fechas de inicio y fin */}
                    <div
                      className={`empresa-form-group empresa-date-group ${loaded ? "empresa-loaded" : ""}`}
                      style={{ transitionDelay: "0.6s" }}
                    >
                      <div className="empresa-date-inputs">
                        <div className="empresa-input-container">
                          <label htmlFor="startDate">Start Date</label>
                          <div className="empresa-input-wrapper">
                            <span className="empresa-input-icon">📅</span>
                            <input
                              type="date"
                              id="startDate"
                              name="startDate"
                              className="empresa-custom-input empresa-date-input"
                              value={formData.startDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="empresa-input-container">
                          <label htmlFor="endDate">End Date</label>
                          <div className="empresa-input-wrapper">
                            <span className="empresa-input-icon">📅</span>
                            <input
                              type="date"
                              id="endDate"
                              name="endDate"
                              className="empresa-custom-input empresa-date-input"
                              value={formData.endDate}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campo de modalidad */}
                    <div
                      className={`empresa-form-group ${loaded ? "empresa-loaded" : ""}`}
                      style={{ transitionDelay: "0.7s" }}
                    >
                      <div className="empresa-select-container">
                        <label htmlFor="modality">Modality</label>
                        <div className="empresa-input-wrapper">
                          <span className="empresa-input-icon">🌐</span>
                          <select
                            id="modality"
                            name="modality"
                            className="empresa-custom-select"
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

                    <div
                      className={`empresa-form-group ${loaded ? "empresa-loaded" : ""}`}
                      style={{ transitionDelay: "0.8s" }}
                    >
                      <div className="empresa-select-container">
                        <label htmlFor="vacancies">Vacancies</label>
                        <div className="empresa-input-wrapper">
                          <span className="empresa-input-icon">👥</span>
                          <select
                            id="vacancies"
                            name="vacancies"
                            className="empresa-custom-select"
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

                    <div
                      className={`empresa-button-container ${loaded ? "empresa-loaded" : ""}`}
                      style={{ transitionDelay: "0.9s" }}
                    >
                      <button className="empresa-publish-button" onClick={publishOffer}>
                        <span className="empresa-button-icon">✈️</span>
                        Publish Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Visualización de ofertas */}
            <div className="empresa-split-column empresa-view-column">
              <div className="empresa-slide-content">
                <div className={`empresa-offers-list-header ${loaded ? "empresa-loaded" : ""}`}>
                  <h2 className="empresa-section-title">
                    <span className="empresa-section-icon">👁️</span>
                    Your Published Offers
                  </h2>
                  <div className="empresa-offers-stats">
                    <div className="empresa-stat-item">
                      <span className="empresa-stat-value">{offers.length}</span>
                      <span className="empresa-stat-label">Total</span>
                    </div>
                    <div className="empresa-stat-item">
                      <span className="empresa-stat-value">{offers.filter((o) => o.status === "active").length}</span>
                      <span className="empresa-stat-label">Active</span>
                    </div>
                    <div className="empresa-stat-item">
                      <span className="empresa-stat-value">
                        {offers.reduce((acc, curr) => acc + Number.parseInt(curr.applications || 0), 0)}
                      </span>
                      <span className="empresa-stat-label">Applications</span>
                    </div>
                  </div>
                </div>

                {offers.length === 0 ? (
                  <div className="empresa-no-offers">
                    <div className="empresa-no-offers-icon">📭</div>
                    <h3>No offers published yet</h3>
                    <p>Create your first job offer to start receiving applications</p>
                  </div>
                ) : (
                  <div className="empresa-offers-list">
                    {offers.map((offer, index) => (
                      <div
                        key={offer.id}
                        className={`empresa-offer-card ${offer.status !== "active" ? "empresa-paused" : ""}`}
                        style={{
                          animationDelay: `${0.1 + index * 0.05}s`,
                          transitionDelay: `${0.1 + index * 0.05}s`,
                        }}
                      >
                        <div className="empresa-offer-header">
                          <h3 className="empresa-offer-title">{offer.title}</h3>
                          <div className="empresa-offer-badges">
                            <span className={`empresa-status-badge empresa-${offer.status}`}>
                              {offer.status === "active" ? "Active" : "Paused"}
                            </span>
                            <span className="empresa-date-badge">{offer.date}</span>
                          </div>
                        </div>

                        <div className="empresa-offer-description">
                          <p>{offer.description}</p>
                        </div>

                        <div className="empresa-offer-details">
                          <div className="empresa-detail-item">
                            <span className="empresa-detail-icon">🔧</span>
                            <span className="empresa-detail-text">{offer.skills}</span>
                          </div>
                          <div className="empresa-detail-item">
                            <span className="empresa-detail-icon">📅</span>
                            <span className="empresa-detail-text">
                              {offer.startDate} to {offer.endDate}
                            </span>
                          </div>
                          <div className="empresa-detail-item">
                            <span className="empresa-detail-icon">{getModalityIcon(offer.modality)}</span>
                            <span
                              className="empresa-detail-text empresa-modality-badge"
                              style={{
                                backgroundColor: `${getModalityColor(offer.modality)}20`,
                                color: getModalityColor(offer.modality),
                              }}
                            >
                              {offer.modality}
                            </span>
                          </div>
                          <div className="empresa-detail-item">
                            <span className="empresa-detail-icon">👥</span>
                            <span className="empresa-detail-text">
                              {offer.vacancies} {Number.parseInt(offer.vacancies) === 1 ? "vacancy" : "vacancies"}
                            </span>
                          </div>
                        </div>

                        <div className="empresa-offer-stats">
                          <div className="empresa-stat">
                            <span className="empresa-stat-number">{offer.applications}</span>
                            <span className="empresa-stat-label">Applications</span>
                          </div>
                        </div>

                        <div className="empresa-offer-actions">
                          <button
                            className="empresa-action-button empresa-view"
                            onClick={() => createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")}
                          >
                            <span className="empresa-action-icon">👁️</span>
                            View Details
                          </button>
                          <button
                            className="empresa-action-button empresa-toggle"
                            onClick={() => toggleOfferStatus(offer.id)}
                          >
                            <span className="empresa-action-icon">{offer.status === "active" ? "⏸️" : "▶️"}</span>
                            {offer.status === "active" ? "Pause" : "Activate"}
                          </button>
                          <button
                            className="empresa-action-button empresa-delete"
                            onClick={() => deleteOffer(offer.id)}
                          >
                            <span className="empresa-action-icon">🗑️</span>
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

        <div className="empresa-footer">
          <p className={loaded ? "empresa-loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  )
}

export default OfertasPage
