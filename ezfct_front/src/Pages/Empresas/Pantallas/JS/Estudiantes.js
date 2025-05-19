"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/Estudiantes.css"

import paperIcon from "../../../Imagenes/paper.png"
import usersIcon from "../../../Imagenes/users.png"
import questionIcon from "../../../Imagenes/question.png"
import logo from "../../../Imagenes/logo.gif"

const Students = () => {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("students")
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)

  // Estado para las ofertas
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

  // Estado para los estudiantes asignados a prácticas
  const [assignedStudents, setAssignedStudents] = useState([
    { id: 1, name: "Michal Jack", time: "28 mins ago", avatar: "/usuario1.jpg", offerId: 1 },
    { id: 2, name: "Sarah Johnson", time: "45 mins ago", avatar: "/usuario2.jpg", offerId: 1 },
    { id: 3, name: "Alex Rivera", time: "1 hour ago", avatar: "/usuario3.png", offerId: 2 },
    { id: 4, name: "Emma Wilson", time: "2 hours ago", avatar: "/usuario4.jpeg", offerId: 3 },
  ])

  // Estado para los estudiantes que han postulado
  const [applicantStudents, setApplicantStudents] = useState([
    { id: 5, name: "David Chen", time: "3 hours ago", avatar: "/usuario2.jpg", offerId: 1, status: "pending" },
    { id: 6, name: "Olivia Martinez", time: "Yesterday", avatar: "/usuario3.png", offerId: 1, status: "pending" },
    { id: 7, name: "James Taylor", time: "Yesterday", avatar: "/usuario1.jpg", offerId: 2, status: "pending" },
    { id: 8, name: "Sophia Lee", time: "2 days ago", avatar: "/usuario2.jpg", offerId: 2, status: "pending" },
    { id: 9, name: "Daniel Brown", time: "3 days ago", avatar: "/usuario3.png", offerId: 3, status: "pending" },
    { id: 10, name: "Isabella Garcia", time: "Last week", avatar: "/usuario4.jpeg", offerId: 3, status: "pending" },
    { id: 11, name: "Ethan Wright", time: "Last week", avatar: "/usuario2.jpg", offerId: 1, status: "pending" },
    { id: 12, name: "Mia Rodriguez", time: "Last month", avatar: "/usuario3.png", offerId: 2, status: "pending" },
  ])

  // Efecto para la animación de entrada y partículas
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

  // Función para manejar el cambio de pestaña
  const handleTabChange = (tabKey, route) => {
    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f59e0b")

    if (route) {
      setTimeout(() => {
        navigate(route)
      }, 300)
    } else {
      setActiveTab(tabKey)
    }
  }

  // Función para seleccionar un estudiante
  const selectStudent = (id) => {
    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#6366f1")

    // Navegar a la página de detalles del estudiante después de un breve retraso
    setTimeout(() => {
      navigate(`/empresas/InfoEstudiantes/${id}`)
    }, 300)
  }

  // Función para abrir el modal de una oferta
  const openOfferModal = (offer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOffer(null)
  }

  // Función para obtener el color de la modalidad
  const getModalityColor = (modality) => {
    switch (modality?.toLowerCase()) {
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
    switch (modality?.toLowerCase()) {
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

  return (
    <div className="stud-page">
      {/* Partículas de fondo */}
      <div className="stud-particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="stud-particle"
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

      <div className="stud-container">
        {/* Header con logo */}
        <div className={`stud-header ${loaded ? "stud-loaded" : ""}`}>
          <div className="stud-decorative-circle stud-circle-1"></div>
          <div className="stud-decorative-circle stud-circle-2"></div>

          <div className={`stud-logo-container ${loaded ? "stud-loaded" : ""}`}>
            <img src={logo || "/placeholder.svg"} alt="Logo" className="stud-logo" />
          </div>

          <h1 className={`stud-title ${loaded ? "stud-loaded" : ""}`}>STUDENTS</h1>
          <div className={`stud-divider ${loaded ? "stud-loaded" : ""}`}></div>
          <p className={`stud-subtitle ${loaded ? "stud-loaded" : ""}`}>Find and connect with talented students</p>
        </div>

        {/* Navigation Tabs simplificado */}
        <div className={`stud-nav-tabs ${loaded ? "stud-loaded" : ""}`}>
          <button
            className={`stud-tab-button ${activeTab === "offers" ? "stud-active" : ""}`}
            onClick={() => handleTabChange("offers", "/empresas/OfertasE")}
          >
            <img src={paperIcon || "/placeholder.svg"} alt="Offers" className="stud-tab-icon" />
            <span>Offers</span>
          </button>
          <button
            className={`stud-tab-button ${activeTab === "students" ? "stud-active" : ""}`}
            onClick={() => handleTabChange("students", "/empresas/Estudiantes")}
          >
            <img src={usersIcon || "/placeholder.svg"} alt="Students" className="stud-tab-icon" />
            <span>Students</span>
          </button>
          <button
            className={`stud-tab-button ${activeTab === "help" ? "stud-active" : ""}`}
            onClick={() => handleTabChange("help", "/empresas/HelpEmpresa")}
          >
            <img src={questionIcon || "/placeholder.svg"} alt="Help" className="stud-tab-icon" />
            <span>Help</span>
          </button>
        </div>

        {/* Contenido principal con dos columnas */}
        <div className="stud-main-content">
          <div className="stud-split-layout">
            {/* Columna izquierda: Mis Ofertas */}
            <div className="stud-split-column stud-offers-column">
              <div className="stud-slide-content">
                <h2 className="stud-section-title">
                  <span className="stud-section-icon">📋</span>
                  My Offers
                </h2>
                <div className="stud-offers-list">
                  {offers.map((offer, index) => (
                    <div
                      key={offer.id}
                      className={`stud-offer-card-mini ${offer.status !== "active" ? "stud-paused" : ""}`}
                      onClick={() => openOfferModal(offer)}
                      style={{
                        animationDelay: `${0.1 + index * 0.05}s`,
                        transitionDelay: `${0.1 + index * 0.05}s`,
                      }}
                    >
                      <div className="stud-offer-header">
                        <h3 className="stud-offer-title">{offer.title}</h3>
                        <div className="stud-offer-badges">
                          <span className={`stud-status-badge stud-${offer.status}`}>
                            {offer.status === "active" ? "Active" : "Paused"}
                          </span>
                        </div>
                      </div>

                      <div className="stud-offer-details">
                        <div className="stud-detail-item">
                          <span className="stud-detail-icon">👥</span>
                          <span className="stud-detail-text">
                            {assignedStudents.filter((student) => student.offerId === offer.id).length} /{" "}
                            {offer.vacancies}
                          </span>
                        </div>
                        <div className="stud-detail-item">
                          <span className="stud-detail-icon">{getModalityIcon(offer.modality)}</span>
                          <span
                            className="stud-detail-text stud-modality-badge"
                            style={{
                              backgroundColor: `${getModalityColor(offer.modality)}20`,
                              color: getModalityColor(offer.modality),
                            }}
                          >
                            {offer.modality}
                          </span>
                        </div>
                      </div>

                      <div className="stud-offer-stats">
                        <div className="stud-stat">
                          <span className="stud-stat-number">
                            {applicantStudents.filter((student) => student.offerId === offer.id).length}
                          </span>
                          <span className="stud-stat-label">Applicants</span>
                        </div>
                      </div>

                      <div className="stud-view-details">
                        <span className="stud-view-icon">👁️</span>
                        <span>View Students</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha: Estudiantes Postulantes */}
            <div className="stud-split-column stud-applicants-column">
              <div className="stud-slide-content">
                <h2 className="stud-section-title">
                  <span className="stud-section-icon">👨‍🎓</span>
                  All Applicants
                </h2>
                <div className="stud-students-grid">
                  {applicantStudents.map((student) => (
                    <div
                      key={student.id}
                      className="stud-student-card"
                      onClick={() => selectStudent(student.id)}
                      style={{
                        animationDelay: `${0.1 + student.id * 0.05}s`,
                        transitionDelay: `${0.1 + student.id * 0.05}s`,
                      }}
                    >
                      <div className="stud-student-avatar">
                        <img
                          src={student.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={`${student.name}'s avatar`}
                        />
                      </div>
                      <div className="stud-student-info">
                        <h3>{student.name}</h3>
                        <p>{student.time}</p>
                        <div className="stud-student-offer-badge">
                          {offers.find((offer) => offer.id === student.offerId)?.title || "Unknown Offer"}
                        </div>
                      </div>
                      <div className="stud-selection-indicator"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal para ver estudiantes de una oferta */}
        {isModalOpen && selectedOffer && (
          <div className="stud-modal-overlay" onClick={closeModal}>
            <div className="stud-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="stud-modal-close" onClick={closeModal}>
                ✕
              </button>

              <div className="stud-modal-header">
                <h2 className="stud-modal-title">{selectedOffer.title}</h2>
                <span className={`stud-status-badge stud-${selectedOffer.status}`}>
                  {selectedOffer.status === "active" ? "Active" : "Paused"}
                </span>
              </div>

              <div className="stud-modal-body">
                <div className="stud-modal-section">
                  <h3 className="stud-modal-section-title">Students in Internship</h3>
                  {assignedStudents.filter((student) => student.offerId === selectedOffer.id).length > 0 ? (
                    <div className="stud-modal-students-grid">
                      {assignedStudents
                        .filter((student) => student.offerId === selectedOffer.id)
                        .map((student) => (
                          <div
                            key={student.id}
                            className="stud-modal-student-card"
                            onClick={() => selectStudent(student.id)}
                          >
                            <div className="stud-student-avatar">
                              <img
                                src={student.avatar || "/placeholder.svg?height=40&width=40"}
                                alt={`${student.name}'s avatar`}
                              />
                            </div>
                            <div className="stud-student-info">
                              <h3>{student.name}</h3>
                              <p>{student.time}</p>
                            </div>
                            <div className="stud-student-status stud-assigned">Assigned</div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="stud-no-students">
                      <p>No students currently assigned to this internship</p>
                    </div>
                  )}
                </div>

                <div className="stud-modal-section">
                  <h3 className="stud-modal-section-title">Applicants</h3>
                  {applicantStudents.filter((student) => student.offerId === selectedOffer.id).length > 0 ? (
                    <div className="stud-modal-students-grid">
                      {applicantStudents
                        .filter((student) => student.offerId === selectedOffer.id)
                        .map((student) => (
                          <div
                            key={student.id}
                            className="stud-modal-student-card"
                            onClick={() => selectStudent(student.id)}
                          >
                            <div className="stud-student-avatar">
                              <img
                                src={student.avatar || "/placeholder.svg?height=40&width=40"}
                                alt={`${student.name}'s avatar`}
                              />
                            </div>
                            <div className="stud-student-info">
                              <h3>{student.name}</h3>
                              <p>{student.time}</p>
                            </div>
                            <div className="stud-student-status stud-pending">Pending</div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="stud-no-students">
                      <p>No applicants for this internship yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="stud-modal-footer">
                <button className="stud-modal-button stud-secondary" onClick={closeModal}>
                  Close
                </button>
                <button
                  className="stud-modal-button stud-primary"
                  onClick={() => {
                    closeModal()
                    setTimeout(() => {
                      navigate("/empresas/OfertasE")
                    }, 300)
                  }}
                >
                  View Offer Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="stud-footer">
          <p className={loaded ? "stud-loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  )
}

export default Students
