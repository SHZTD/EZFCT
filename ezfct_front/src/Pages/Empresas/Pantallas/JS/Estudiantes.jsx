"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/Estudiantes.css"

import paperIcon from "../../../Imagenes/paper.png"
import usersIcon from "../../../Imagenes/users.png"
import { API_URL } from "../../../../constants"
import { User, UserRound, UserCircle } from "lucide-react"

const Students = () => {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("students")
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)

  // State for offers (fetched from API)
  const [offers, setOffers] = useState([])

  // State for assigned students
  const [assignedStudents, setAssignedStudents] = useState([])

  // State for applicant students
  const [applicantStudents, setApplicantStudents] = useState([])

  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  // Function to get random user icon based on ID
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

  // Fetch offers from API
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

      if (!response.ok) throw new Error("Failed to fetch offers")

      const data = await response.json()
      setOffers(data)

      // Fetch applicants for each offer
      const applicantsPromises = data.map((offer) => fetchApplicants(offer.idPractica))
      const applicantsResults = await Promise.all(applicantsPromises)

      // Combine all applicants into one array
      const allApplicants = applicantsResults.flat()
      setApplicantStudents(
        allApplicants.map((applicant) => ({
          id: applicant.idEstudiante,
          name: `${applicant.nombre} ${applicant.apellido}`,
          time: new Date(applicant.fechaPostulacion).toLocaleDateString(),
          offerId: applicant.idPractica,
          status: applicant.estado || "pending",
          cvFileName: applicant.cvFileName,
          motivacion: applicant.motivacion,
          postulacionId: applicant.idPostulacion,
        })),
      )
    } catch (err) {
      setError(err.message)
      console.error("Error fetching offers:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch applicants for a specific offer
  const fetchApplicants = async (offerId) => {
    try {
      const response = await fetch(`${API_URL}/api/practicas/${offerId}/postulaciones`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch applicants")

      const data = await response.json()

      return data.map((postulacion) => ({
        postulacionId: postulacion.idPostulacion,
        estado: postulacion.estado,
        fechaPostulacion: postulacion.fechaPostulacion,

        // Student info (from Usuario via Alumno)
        nombre: postulacion.nombre || "Unknown",
        apellido: postulacion.apellido || "Student",
        email: postulacion.email,

        // Student profile (from Alumno)
        biografia: postulacion.biografia,
        habilidades: postulacion.habilidades,
        educacion: postulacion.educacion,

        // Offer info
        idPractica: offerId,
        tituloPractica: postulacion.tituloPractica || "Unknown Offer",

      }))
    } catch (err) {
      console.error("Error fetching applicants:", err)
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

      if (!response.ok) throw new Error("Failed to accept applicant")

      // Refresh the data
      await fetchOffers()
    } catch (err) {
      setError(err.message)
    }

    console.log(postulacionId)
  }

  // Handle rejecting an applicant
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

      if (!response.ok) throw new Error("Failed to reject applicant")

      // Refresh all data
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

  // Fetch students data (mock data for now)
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL + "/api/practicas/asignados", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch assigned students")

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
      console.error("Error fetching assigned students:", err)
    }
  }

  // Initial load effect
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

  // Create initial particles
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

  // Create particle explosion effect
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

  // Handle tab change
  const handleTabChange = (tabKey, route) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f59e0b")
    if (route) {
      setTimeout(() => navigate(route), 300)
    } else {
      setActiveTab(tabKey)
    }
  }

  // Select student - FIXED ROUTE
  const selectStudent = (student) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#6366f1")
    // Use the actual student ID from the postulation data
    setTimeout(() => navigate(`/empresas/InforEstudiante/${student.postulacionId}`), 300)
  }

  // Open offer modal and fetch applicants
  const openOfferModal = async (offer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
  }

  const countApplicantsForOffer = (offerId) => {
    return applicantStudents.filter((student) => student.offerId === offerId).length
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOffer(null)
  }

  // Get modality color
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

  // Get modality icon
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="stud-page">
      {/* Background particles */}
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
        {/* Header */}
        <div className={`stud-header ${loaded ? "stud-loaded" : ""}`}>
          <div className="stud-decorative-circle stud-circle-1"></div>
          <div className="stud-decorative-circle stud-circle-2"></div>
          <h1 className={`stud-title ${loaded ? "stud-loaded" : ""}`}>STUDENTS</h1>
          <div className={`stud-divider ${loaded ? "stud-loaded" : ""}`}></div>
          <p className={`stud-subtitle ${loaded ? "stud-loaded" : ""}`}>Find and connect with talented students</p>
        </div>

        {/* Navigation tabs */}
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
        </div>

        {/* Main content */}
        <div className="stud-main-content" style={{ borderRadius: "0 0 0 0" }}>
          <div className="stud-split-layout" style={{ minHeight: "520px" }}>
            {isLoading ? (
              <div className="stud-loading">
                <div className="stud-spinner"></div>
                <p>Loading offers...</p>
              </div>
            ) : error ? (
              <div className="stud-error">
                <p>Error loading offers: {error}</p>
                <button onClick={fetchOffers}>Retry</button>
              </div>
            ) : (
              <>
                {/* Left column: My Offers */}
                <div className="stud-split-column stud-offers-column" style={{ maxHeight: "520px" }}>
                  <div className="stud-slide-content" style={{ height: "100%", borderRadius: "0" }}>
                    <h2 className="stud-section-title">
                      <span className="stud-section-icon">📋</span>
                      My Offers
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
                              <span className={`stud-status-badge stud-${offer.estado?.toLowerCase()}`}>
                                {offer.estado === "ACTIVA" ? "Active" : "Inactive"}
                              </span>
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

                {/* Right column: Applicants */}
                <div className="stud-split-column stud-applicants-column" style={{ maxHeight: "520px" }}>
                  <div className="stud-slide-content" style={{ height: "100%", borderRadius: "0" }}>
                    <h2 className="stud-section-title">
                      <span className="stud-section-icon">👨‍🎓</span>
                      All Applicants
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
                                  "Unknown Offer"}
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

        {/* Footer unificado */}
        <div className="stud-footer" style={{ borderRadius: "0 0 24px 24px" }}>
          <p className={loaded ? "stud-loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>

        {/* Offer modal */}
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
                <span className={`stud-status-badge stud-${selectedOffer.estado?.toLowerCase()}`}>
                  {selectedOffer.estado === "ACTIVA" ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="stud-modal-body">
                <div className="stud-modal-section">
                  <h3 className="stud-modal-section-title">Students in Internship</h3>
                  {assignedStudents.filter((student) => student.offerId === selectedOffer.idPractica).length > 0 ? (
                    <div className="stud-modal-students-grid">
                      {assignedStudents
                        .filter((student) => student.offerId === selectedOffer.idPractica)
                        .map((student) => (
                          <div
                            key={student.postulacionId}
                            className="stud-modal-student-card"
                            onClick={() => selectStudent(student)}
                          >
                            <div className="stud-student-avatar">{getUserIcon(student.postulacionId)}</div>
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
                  {applicantStudents.length > 0 ? (
                    <div className="stud-modal-students-grid">
                      {applicantStudents.map((student) => (
                        <div
                          key={student.postulacionId}
                          className="stud-modal-student-card"
                          onClick={() => selectStudent(student)}
                        >
                          <div className="stud-student-avatar">{getUserIcon(student.postulacionId)}</div>
                          <div className="stud-student-info">
                            <h3>{student.name}</h3>
                            <p>Applied: {student.time}</p>
                            <div className="stud-student-details">
                              <span>CV: {student.cvFileName || "Not provided"}</span>
                              <span>Motivation: {student.motivacion?.substring(0, 50)}...</span>
                            </div>
                          </div>
                          <div
                            className="stud-student-actions"
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginTop: "8px",
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              className={`stud-action-button stud-accept ${student.status === "accepted" ? "stud-disabled" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAcceptApplicant(student.postulacionId)
                              }}
                              disabled={student.status === "accepted"}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                backgroundColor: student.status === "accepted" ? "#9ca3af" : "#10b981",
                                color: "white",
                                fontWeight: "600",
                                marginRight: "8px",
                                border: "none",
                                cursor: student.status === "accepted" ? "not-allowed" : "pointer",
                                fontSize: "14px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              {student.status === "accepted" ? "Accepted" : "Accept"}
                            </button>
                            <button
                              className={`stud-action-button stud-reject ${student.status === "rejected" ? "stud-disabled" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRejectApplicant(student.postulacionId)
                              }}
                              disabled={student.status === "rejected"}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                backgroundColor: student.status === "rejected" ? "#9ca3af" : "#ef4444",
                                color: "white",
                                fontWeight: "600",
                                border: "none",
                                cursor: student.status === "rejected" ? "not-allowed" : "pointer",
                                fontSize: "14px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              {student.status === "rejected" ? "Rejected" : "Reject"}
                            </button>
                          </div>
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
                    setTimeout(() => navigate("/empresas/OfertasE"), 300)
                  }}
                >
                  View Offer Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Students
