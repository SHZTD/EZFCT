import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/Estudiantes.css"

import paperIcon from "../../../Imagenes/paper.png"
import usersIcon from "../../../Imagenes/users.png"
import { API_URL } from "../../../../constants"
import { User, UserRound, UserCircle } from "lucide-react"

const Estudiantes = () => {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("estudiantes")
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)

  // Estado para las ofertas (obtenidas de la API)
  const [offers, setOffers] = useState([])

  // Estado para estudiantes asignados
  const [assignedStudents, setAssignedStudents] = useState([])

  // Estado para estudiantes postulados
  const [applicantStudents, setApplicantStudents] = useState([])

  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  // Función para obtener un icono de usuario aleatorio basado en ID
  const getUserIcon = (id) => {
    const randomNum = id % 3
    switch (randomNum) {
      case 0:
        return <User className="w-8 h-8 text-gray-700" />
      case 1:
        return <UserRound className="w-8 h-8 text-gray-700" />
      case 2:
        return <UserCircle className="w-8 h-8 text-gray-700" />
      default:
        return <User className="w-8 h-8 text-gray-700" />
    }
  }

  // Obtener ofertas de la API
  const fetchOffers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(API_URL + "/api/practicas/empresa", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Error al cargar las ofertas")

      const data = await response.json()
      setOffers(data)

      // Obtener postulantes para cada oferta
      const applicantsPromises = data.map((offer) => fetchApplicants(offer.idPractica))
      const applicantsResults = await Promise.all(applicantsPromises)

      // Combinar todos los postulantes en un solo array
      const allApplicants = applicantsResults.flat()
      setApplicantStudents(
        allApplicants.map((applicant) => ({
          id: applicant.idEstudiante,
          name: `${applicant.nombre} ${applicant.apellido}`,
          time: new Date(applicant.fechaPostulacion).toLocaleDateString(),
          offerId: applicant.idPractica,
          status: applicant.estado || "pendiente",
          cvFileName: applicant.cvFileName,
          motivacion: applicant.motivacion,
          postulacionId: applicant.postulacionId,
        })),
      )
    } catch (err) {
      setError(err.message)
      console.error("Error al obtener ofertas:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener postulantes para una oferta específica
  const fetchApplicants = async (offerId) => {
    try {
      const response = await fetch(`${API_URL}/api/practicas/${offerId}/postulaciones`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Error al cargar postulantes")

      const data = await response.json()

      return data.map((postulacion) => ({
        postulacionId: postulacion.idPostulacion,
        estado: postulacion.estado,
        fechaPostulacion: postulacion.fechaPostulacion,

        // Información del estudiante (de Usuario via Alumno)
        nombre: postulacion.nombre || "Desconocido",
        apellido: postulacion.apellido || "Estudiante",
        email: postulacion.email,

        // Perfil del estudiante (de Alumno)
        biografia: postulacion.biografia,
        habilidades: postulacion.habilidades,
        educacion: postulacion.educacion,

        // Información de la oferta
        idPractica: offerId,
        tituloPractica: postulacion.tituloPractica || "Oferta desconocida",

      }))
    } catch (err) {
      console.error("Error al obtener postulantes:", err)
      return []
    }
  }

  const handleAcceptApplicant = async (postulacionId) => {
    try {
      const response = await fetch(`${API_URL}/api/practicas/postulaciones/${postulacionId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Error al aceptar postulante")

      // Actualizar los datos
      await fetchOffers()
    } catch (err) {
      setError(err.message)
    }

    console.log(postulacionId)
  }

  // Manejar el rechazo de un postulante
  const handleRejectApplicant = async (postulacionId) => {
    try {
      console.log(postulacionId)
      const response = await fetch(`${API_URL}/api/practicas/postulaciones/${postulacionId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Error al rechazar postulante")

      // Actualizar todos los datos
      await fetchOffers()
      await fetchStudents()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  // Obtener datos de estudiantes (datos de prueba por ahora)
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL + "/api/practicas/asignados", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Error al cargar estudiantes asignados")

      const data = await response.json()
      setAssignedStudents(
        data.map((student) => ({
          id: student.idEstudiante,
          name: `${student.nombre} ${student.apellido}`,
          time: new Date(student.fechaAsignacion).toLocaleDateString(),
          offerId: student.idPractica,
          postulacionId: student.idPostulacion,
        })),
      )
    } catch (err) {
      setError(err.message)
      console.error("Error al obtener estudiantes asignados:", err)
    }
  }

  // Efecto de carga inicial
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
    createInitialParticles()
    fetchOffers()
    fetchStudents()

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
        })),
      )
    }, 50)

    const handleResize = () => {
      createInitialParticles()
    }

    window.addEventListener("resize", handleResize)

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Crear partículas iniciales
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

  const formatRejectionDate = (student) => {
    if (student.rejectionDate) {
      return new Date(student.rejectionDate).toLocaleDateString();
    }
    
    return student.time;
  };

  // Crear efecto de explosión de partículas
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

  // Manejar cambio de pestaña
  const handleTabChange = (tabKey, route) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f59e0b")
    if (route) {
      setTimeout(() => navigate(route), 300)
    } else {
      setActiveTab(tabKey)
    }
  }

  // Seleccionar estudiante - RUTA FIJADA
  const selectStudent = (student) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#6366f1")
    // Usar el ID real del estudiante desde los datos de postulación
    setTimeout(() => navigate(`/empresas/InforEstudiante/${student.postulacionId}`), 300)
  }

  // Abrir modal de oferta y obtener postulantes
  const openOfferModal = async (offer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
  }

  const countApplicantsForOffer = (offerId) => {
    return applicantStudents.filter((student) => student.offerId === offerId).length
  }

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOffer(null)
  }

  // Obtener color de modalidad
  const getModalityColor = (modality) => {
    switch (modality?.toLowerCase()) {
      case "presencial":
        return "#10b981"
      case "remota":
        return "#3b82f6"
      case "híbrido":
      case "hibrido":
        return "#8b5cf6"
      default:
        return "#f59e0b"
    }
  }

  // Obtener icono de modalidad
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

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
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

      <div className="user-icon" onClick={() => setShowUserMenu(!showUserMenu)}>
        🙎🏻‍♂️
      </div>

      {showUserMenu && (
        <div ref={userMenuRef} className="user-menu">
          <div className="user-menu-item" onClick={handleLogout}>
            <span>Cerrar Sesión</span>
          </div>
        </div>
      )}

      <div className="stud-container">
        {/* Encabezado */}
        <div className={`stud-header ${loaded ? "stud-loaded" : ""}`}>
          <div className="stud-decorative-circle stud-circle-1"></div>
          <div className="stud-decorative-circle stud-circle-2"></div>
          <h1 className={`stud-title ${loaded ? "stud-loaded" : ""}`}>ESTUDIANTES</h1>
          <div className={`stud-divider ${loaded ? "stud-loaded" : ""}`}></div>
          <p className={`stud-subtitle ${loaded ? "stud-loaded" : ""}`}>Encuentra y conecta con estudiantes talentosos</p>
        </div>

        {/* Pestañas de navegación */}
        <div className={`stud-nav-tabs ${loaded ? "stud-loaded" : ""}`}>
          <button
            className={`stud-tab-button ${activeTab === "ofertas" ? "stud-active" : ""}`}
            onClick={() => handleTabChange("ofertas", "/empresas/OfertasE")}
          >
            <img src={paperIcon || "/placeholder.svg"} alt="Ofertas" className="stud-tab-icon" />
            <span>Ofertas</span>
          </button>
          <button
            className={`stud-tab-button ${activeTab === "estudiantes" ? "stud-active" : ""}`}
            onClick={() => handleTabChange("estudiantes", "/empresas/Estudiantes")}
          >
            <img src={usersIcon || "/placeholder.svg"} alt="Estudiantes" className="stud-tab-icon" />
            <span>Estudiantes</span>
          </button>
        </div>

        {/* Contenido principal */}
        <div className="stud-main-content" style={{ borderRadius: "0 0 0 0" }}>
          <div className="stud-split-layout" style={{ minHeight: "520px" }}>
            {isLoading ? (
              <div className="stud-loading">
                <div className="stud-spinner"></div>
                <p>Cargando ofertas...</p>
              </div>
            ) : error ? (
              <div className="stud-error">
                <p>Error al cargar ofertas: {error}</p>
                <button onClick={fetchOffers}>Reintentar</button>
              </div>
            ) : (
              <>
                {/* Columna izquierda: Mis Ofertas */}
                <div className="stud-split-column stud-offers-column" style={{ maxHeight: "520px" }}>
                  <div className="stud-slide-content" style={{ height: "100%", borderRadius: "0" }}>
                    <h2 className="stud-section-title">
                      <span className="stud-section-icon">📋</span>
                      Mis Ofertas
                    </h2>
                    <div className="stud-offers-list">
                      {offers.map((offer, index) => (
                        <div
                          key={offer.idPractica}
                          className={`stud-offer-card-mini ${offer.estado !== "ACTIVA" ? "stud-paused" : ""}`}
                          onClick={() => openOfferModal(offer)}
                          style={{
                            animationDelay: `${0.1 + index * 0.05}s`,
                            transitionDelay: `${0.1 + index * 0.05}s`,
                          }}
                        >
                          <div className="stud-offer-header">
                            <h3 className="stud-offer-title">{offer.titulo}</h3>
                            <div className="stud-offer-badges">
                            </div>
                          </div>

                          <div className="stud-offer-details">
                            <div className="stud-detail-item">
                              <span className="stud-detail-icon">👥</span>
                              <span className="stud-detail-text">
                                {assignedStudents.filter((student) => student.offerId === offer.idPractica).length} /{" "}
                                {offer.vacantes}
                              </span>
                            </div>
                            <div className="stud-detail-item">
                              <span className="stud-detail-icon">{getModalityIcon(offer.modalidad)}</span>
                              <span
                                className="stud-detail-text stud-modality-badge"
                                style={{
                                  backgroundColor: `${getModalityColor(offer.modalidad)}20`,
                                  color: getModalityColor(offer.modalidad),
                                }}
                              >
                                {offer.modalidad?.toLowerCase()}
                              </span>
                            </div>
                          </div>

                          <div className="stud-offer-stats">
                            <div className="stud-stat">
                              <span className="stud-stat-number">{countApplicantsForOffer(offer.idPractica)}</span>
                              <span className="stud-stat-label">Postulantes</span>
                            </div>
                          </div>

                          <div className="stud-view-details">
                            <span className="stud-view-icon">👁️</span>
                            <span>Ver Estudiantes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Columna derecha: Postulantes */}
                <div className="stud-split-column stud-applicants-column" style={{ maxHeight: "520px" }}>
                  <div className="stud-slide-content" style={{ height: "100%", borderRadius: "0" }}>
                    <h2 className="stud-section-title">
                      <span className="stud-section-icon">👨‍🎓</span>
                      Todos los Postulantes
                    </h2>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div className="stud-students-grid">
                        {applicantStudents.map((student) => (
                          <div
                            key={student.postulacionId}
                            className="stud-student-card"
                            onClick={() => selectStudent(student)}
                            style={{
                              animationDelay: `${0.1 + student.postulacionId * 0.05}s`,
                              transitionDelay: `${0.1 + student.postulacionId * 0.05}s`,
                            }}
                          >
                            <div
                              className="stud-student-avatar"
                              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                            >
                              {getUserIcon(student.postulacionId)}
                            </div>
                            <div className="stud-student-info">
                              <h3>{student.name}</h3>
                              <p>{student.time}</p>
                              <div className="stud-student-offer-badge">
                                {offers.find((offer) => offer.idPractica === student.offerId)?.titulo ||
                                  "Oferta desconocida"}
                              </div>
                            </div>
                            <div className="stud-selection-indicator"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pie de página unificado */}
        <div className="stud-footer" style={{ borderRadius: "0 0 24px 24px" }}>
          <p className={loaded ? "stud-loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>

        {/* Modal de oferta */}
        {isModalOpen && selectedOffer && (
          <div className="stud-modal-overlay" onClick={closeModal}>
            <div className="stud-modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="empresa-modal-close"
                onClick={() => setIsModalOpen(false)}
                style={{ transform: "none !important" }}
                onMouseEnter={(e) => (e.target.style.transform = "none")}
                onMouseLeave={(e) => (e.target.style.transform = "none")}
              >
                ✕
              </button>

              <div className="stud-modal-header">
                <h2 className="stud-modal-title">{selectedOffer.titulo}</h2>
              </div>

              <div className="stud-modal-body">
                <div className="stud-modal-section">
                  <h3 className="stud-modal-section-title">Estudiantes en Prácticas</h3>
                  {assignedStudents.filter(student => 
                    student.offerId === selectedOffer.idPractica && 
                    student.status === "ACEPTADA"
                  ).length > 0 ? (
                    <div className="stud-modal-students-grid">
                      {assignedStudents
                        .filter(student => 
                          student.offerId === selectedOffer.idPractica && 
                          student.status === "ACEPTADA"
                        )
                        .map((student) => (
                          <div
                            key={student.postulacionId}
                            className="stud-modal-student-card"
                            onClick={() => selectStudent(student)}
                          >
                            <div className="stud-student-avatar">{getUserIcon(student.postulacionId)}</div>
                            <div className="stud-student-info">
                              <h3>{student.name}</h3>
                              <p>Asignado el: {student.time}</p>
                            </div>
                            <div className="stud-student-status stud-assigned">Asignado</div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="stud-no-students">
                      <p>No hay estudiantes asignados actualmente a esta práctica</p>
                    </div>
                  )}
                </div>

                <div className="stud-modal-section">
                    <h3 className="stud-modal-section-title">Postulantes</h3>
                    {applicantStudents.filter(student => 
                      student.offerId === selectedOffer.idPractica && 
                      student.status !== "ACEPTADA"
                    ).length > 0 ? (
                      <div className="stud-modal-students-grid">
                        {applicantStudents
                          .filter(student => 
                            student.offerId === selectedOffer.idPractica && 
                            student.status !== "ACEPTADA"
                          )
                          .map((student) => (
                            <div
                              key={student.postulacionId}
                              className={`stud-modal-student-card ${
                                student.status === "RECHAZADA" ? "stud-rejected-card" : ""
                              }`}
                              onClick={() => student.status !== "RECHAZADA" && selectStudent(student)}
                            >
                              <div className="stud-student-avatar">{getUserIcon(student.postulacionId)}</div>
                              <div className="stud-student-info">
                                <h3>{student.name}</h3>
                                <p>Postulado: {student.time}</p>
                                {student.status === "RECHAZADA" && (
                                  <p className="stud-rejection-date">Rechazado el: {formatRejectionDate(student)}</p>
                                )}
                              </div>
                              
                              {/* Estado */}
                              <div className={`stud-student-status ${
                                student.status === "RECHAZADA" ? "stud-rejected" : "stud-pending"
                              }`}>
                                {student.status === "RECHAZADA" ? "Rechazado" : "Pendiente"}
                              </div>

                              {/* Acciones - Solo mostrar para postulaciones pendientes */}
                              {student.status !== "RECHAZADA" && (
                                <div className="stud-student-actions">
                                  <button
                                    className="stud-action-button stud-accept"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcceptApplicant(student.postulacionId);
                                    }}
                                  >
                                    Aceptar
                                  </button>
                                  <button
                                    className="stud-action-button stud-reject"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRejectApplicant(student.postulacionId);
                                    }}
                                  >
                                    Rechazar
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="stud-no-students">
                        <p>No hay postulantes para esta práctica aún</p>
                      </div>
                    )}
                </div>
              </div>

              <div className="stud-modal-footer">
                <button className="stud-modal-button stud-secondary" onClick={closeModal}>
                  Cerrar
                </button>
                <button
                  className="stud-modal-button stud-primary"
                  onClick={() => {
                    closeModal()
                    setTimeout(() => navigate("/empresas/OfertasE"), 300)
                  }}
                >
                  Ver Detalles de Oferta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Estudiantes