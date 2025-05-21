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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    startDate: "",
    endDate: "",
    modality: "presencial",
    vacancies: "1",
  })

  // Estado para las ofertas publicadas (conectado al backend)
  const [offers, setOffers] = useState([])

  const navigate = useNavigate()

  // Add these state variables at the top of the component with the other useState declarations:
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)

  // Efecto para la animación de entrada
  useEffect(() => {
    // Marcar como cargado para iniciar animaciones
    setTimeout(() => setLoaded(true), 100)

    // Cargar ofertas desde el backend
    fetchOffers()
  }, [])

  // Función para obtener ofertas del backend
  const fetchOffers = async () => {
    try {
      const response = await fetch("http://192.168.22.115:7484/api/practicas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOffers(data)
      } else {
        console.error("Error fetching offers")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const navigateTo = (route) => {
    navigate(`/${route}`)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const publishOffer = async () => {
    // Validar que todos los campos estén completos
    if (!formData.title || !formData.description || !formData.skills || !formData.startDate || !formData.endDate) {
      // Efecto de vibración si faltan campos
      document.querySelector(".empresa-form-card").classList.add("empresa-shake")
      setTimeout(() => {
        document.querySelector(".empresa-form-card").classList.remove("empresa-shake")
      }, 500)
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos para el backend
      const offerData = {
        titulo: formData.title,
        descripcion: formData.description,
        requisitos: formData.skills,
        fechaInicio: new Date(formData.startDate).toISOString(),
        fechaFin: new Date(formData.endDate).toISOString(),
        modalidad: formData.modality.toUpperCase(),
        vacantes: Number.parseInt(formData.vacancies),
      }

      const response = await fetch("http://192.168.22.115:7484/api/practicas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(offerData),
      })

      console.log("intentando post con token:" + localStorage.getItem('token'))

      if (response.ok) {
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

        // Recargar ofertas
        fetchOffers()
      } else {
        console.error("Error creating offer")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para eliminar una oferta
  const deleteOffer = async (id) => {
    try {
      const response = await fetch(`http://192.168.22.115:7484/api/practicas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        // Actualizar la lista de ofertas
        fetchOffers()
      } else {
        console.error("Error deleting offer")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // Función para obtener el color de la modalidad
  const getModalityColor = (modality) => {
    switch (modality?.toLowerCase()) {
      case "presencial":
        return "#10b981" // verde
      case "remota":
      case "remoto":
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
    switch (modality?.toLowerCase()) {
      case "presencial":
        return "🏢"
      case "remota":
      case "remoto":
        return "🏠"
      case "híbrido":
      case "hibrido":
        return "🔄"
      default:
        return "📍"
    }
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
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
                      <span className="empresa-stat-value">
                        {offers.reduce((acc, curr) => acc + (curr.postulaciones?.length || 0), 0)}
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
                        key={offer.idPractica}
                        className="empresa-offer-card"
                        style={{
                          animationDelay: `${0.1 + index * 0.05}s`,
                          transitionDelay: `${0.1 + index * 0.05}s`,
                        }}
                      >
                        <div className="empresa-offer-header">
                          <h3 className="empresa-offer-title">{offer.titulo}</h3>
                          <div className="empresa-offer-badges">
                            <span className="empresa-date-badge">{formatDate(offer.fechaInicio)}</span>
                          </div>
                        </div>

                        <div className="empresa-offer-description">
                          <p>{offer.descripcion}</p>
                        </div>

                        <div className="empresa-offer-details">
                          <div className="empresa-detail-item">
                            <span className="empresa-detail-icon">🔧</span>
                            <span className="empresa-detail-text">{offer.requisitos}</span>
                          </div>
                          <div className="empresa-detail-item">
                            <span className="empresa-detail-icon">📅</span>
                            <span className="empresa-detail-text">
                              {formatDate(offer.fechaInicio)} to {formatDate(offer.fechaFin)}
                            </span>
                          </div>
                          <div className="empresa-detail-item">
                            <span className="empresa-detail-icon">{getModalityIcon(offer.modalidad)}</span>
                            <span
                              className="empresa-detail-text empresa-modality-badge"
                              style={{
                                backgroundColor: `${getModalityColor(offer.modalidad)}20`,
                                color: getModalityColor(offer.modalidad),
                              }}
                            >
                              {offer.modalidad?.toLowerCase()}
                            </span>
                          </div>
                          <div className="empresa-detail-item">
                            <span className="empresa-detail-icon">👥</span>
                            <span className="empresa-detail-text">
                              {offer.vacantes} {offer.vacantes === 1 ? "vacancy" : "vacancies"}
                            </span>
                          </div>
                        </div>

                        <div className="empresa-offer-stats">
                          <div className="empresa-stat">
                            <span className="empresa-stat-number">{offer.postulaciones?.length || 0}</span>
                            <span className="empresa-stat-label">Applications</span>
                          </div>
                        </div>

                        <div className="empresa-offer-actions">
                          <button
                            className="empresa-action-button empresa-view"
                            onClick={() => {
                              // Set the selected offer and open the modal
                              setSelectedOffer(offer)
                              setIsModalOpen(true)
                            }}
                          >
                            <span className="empresa-action-icon">👁️</span>
                            View Details
                          </button>
                          <button
                            className="empresa-action-button empresa-delete"
                            onClick={() => deleteOffer(offer.idPractica)}
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

        {/* Modal component */}
        {isModalOpen && selectedOffer && (
          <div className="empresa-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="empresa-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="empresa-modal-close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>

              <div className="empresa-modal-header">
                <h2 className="empresa-modal-title">{selectedOffer.titulo}</h2>
              </div>

              <div className="empresa-modal-body">
                <div className="empresa-modal-section">
                  <h3 className="empresa-modal-section-title">Description</h3>
                  <p className="empresa-modal-text">{selectedOffer.descripcion}</p>
                </div>

                <div className="empresa-modal-section">
                  <h3 className="empresa-modal-section-title">Details</h3>
                  <div className="empresa-modal-details">
                    <div className="empresa-modal-detail-item">
                      <span className="empresa-modal-detail-label">Skills Required:</span>
                      <span className="empresa-modal-detail-value">{selectedOffer.requisitos}</span>
                    </div>
                    <div className="empresa-modal-detail-item">
                      <span className="empresa-modal-detail-label">Period:</span>
                      <span className="empresa-modal-detail-value">
                        {formatDate(selectedOffer.fechaInicio)} to {formatDate(selectedOffer.fechaFin)}
                      </span>
                    </div>
                    <div className="empresa-modal-detail-item">
                      <span className="empresa-modal-detail-label">Modality:</span>
                      <span
                        className="empresa-modal-detail-value empresa-modality-badge"
                        style={{
                          backgroundColor: `${getModalityColor(selectedOffer.modalidad)}20`,
                          color: getModalityColor(selectedOffer.modalidad),
                        }}
                      >
                        {selectedOffer.modalidad?.toLowerCase()}
                      </span>
                    </div>
                    <div className="empresa-modal-detail-item">
                      <span className="empresa-modal-detail-label">Vacancies:</span>
                      <span className="empresa-modal-detail-value">
                        {selectedOffer.vacantes} {selectedOffer.vacantes === 1 ? "vacancy" : "vacancies"}
                      </span>
                    </div>
                    <div className="empresa-modal-detail-item">
                      <span className="empresa-modal-detail-label">Applications:</span>
                      <span className="empresa-modal-detail-value">{selectedOffer.postulaciones?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="empresa-modal-actions">
                  <button
                    className="empresa-modal-button empresa-modal-primary"
                    onClick={() => {
                      setIsModalOpen(false)
                      navigateTo("empresas/Estudiantes")
                    }}
                  >
                    <span className="empresa-button-icon">👨‍🎓</span>
                    View Students
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="empresa-footer">
          <p className={loaded ? "empresa-loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  )
}

export default OfertasPage
