import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Send, MessageSquare, X, ArrowLeft, Clock } from "lucide-react"
import "../CSS/AreaContacto.css"
import { API_URL } from "../../../../constants"

const ContactoProfesor = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showModal, setShowModal] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionHistory, setQuestionHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const modalRef = useRef(null)
  const textareaRef = useRef(null)

  // Fetch question history from API
  const fetchQuestionHistory = async () => {
    setIsLoadingHistory(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/reporte/profesor`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch question history")
      
      const data = await response.json()
      // Map the API response to our expected format
      const mappedData = data.map(report => ({
        id: report.idReporte,
        question: report.mensaje,
        answer: report.respuesta, // This should now include admin responses
        date: report.fechaCreacion || new Date().toISOString(),
        status: report.respuesta ? "answered" : "pending",
      }))
      
      // Sort by date, newest first
      mappedData.sort((a, b) => new Date(b.date) - new Date(a.date))
      setQuestionHistory(mappedData)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching question history:", err)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Initialization and particle effects
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
    createInitialParticles()

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.pageX, y: e.pageY })
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

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && showModal) {
        closeModal()
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
      clearInterval(interval)
    }
  }, [showModal])

  // Load history when modal opens
  useEffect(() => {
    if (showModal) {
      fetchQuestionHistory()
    }
  }, [showModal])

  // Particle effects functions
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

  // UI interaction handlers
  const handleGoBack = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e")
    setTimeout(() => navigate(-1), 300)
  }

  const openModal = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    setShowModal(true)
  }

  const closeModal = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e")
    setShowModal(false)
  }

  const handleSubmitQuestion = async (e) => {
    e.preventDefault()

    if (!currentQuestion.trim()) return

    setIsSubmitting(true)
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/reporte/profesor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mensaje: currentQuestion
        }),
      })

      if (!response.ok) throw new Error("Failed to submit question")

      const newReport = await response.json()
      
      // Add the new question to our local state
      const newQuestion = {
        id: newReport.idReporte,
        question: newReport.mensaje,
        answer: newReport.respuesta || null,
        date: new Date().toISOString(),
        status: newReport.respuesta ? "answered" : "pending",
      }

      setQuestionHistory((prev) => [newQuestion, ...prev])
      setCurrentQuestion("")
      
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    } catch (err) {
      setError(err.message)
      console.error("Error submitting question:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="contacto-page">
      {/* Background particles */}
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

      {/* Cursor light effect */}
      <div
        className="cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      <div className="contacto-container">
        {/* Header */}
        <header className={`page-header ${loaded ? "loaded" : ""}`}>
          <button className="back-button" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <div className="header-content">
            <h1 className="page-title">Área de Contacto</h1>
            <p className="page-subtitle">Envía tus consultas y revisa las respuestas</p>
          </div>
          <div className="header-gradient"></div>
        </header>

        {/* Main content */}
        <div className={`contacto-content ${loaded ? "loaded" : ""}`}>
          <div className="contacto-card">
            <div className="card-header">
              <MessageSquare className="card-icon" size={24} />
              <h2>Envía tu consulta</h2>
            </div>

            <form onSubmit={handleSubmitQuestion} className="contacto-form">
              <div className="form-group">
                <label htmlFor="question">Tu pregunta</label>
                <textarea
                  ref={textareaRef}
                  id="question"
                  placeholder="Escribe aquí tu consulta..."
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  rows={5}
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={isSubmitting || !currentQuestion.trim()}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Enviar consulta</span>
                    </>
                  )}
                </button>

                <button type="button" className="view-responses-button" onClick={openModal}>
                  <MessageSquare size={18} />
                  <span>Ver respuestas</span>
                </button>
              </div>
            </form>

            <div className="contact-info">
              <p>
                <strong>Nota:</strong> Las respuestas suelen tardar entre 24-48 horas laborables.
              </p>
            </div>
          </div>
        </div>

        {/* Responses modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container" ref={modalRef}>
              <div className="modal-header">
                <h2>Historial de consultas</h2>
                <button className="close-button" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-content">
                {isLoadingHistory ? (
                  <div className="loading-history">
                    <span className="spinner"></span>
                    <p>Cargando historial...</p>
                  </div>
                ) : error ? (
                  <div className="error-message">
                    <p>Error al cargar el historial: {error}</p>
                    <button onClick={fetchQuestionHistory}>Reintentar</button>
                  </div>
                ) : questionHistory.length === 0 ? (
                  <div className="no-questions">
                    <MessageSquare size={40} />
                    <p>No hay consultas realizadas</p>
                  </div>
                ) : (
                  <div className="questions-list">
                    {questionHistory.map((item) => (
                      <div key={item.id} className={`question-item ${item.status}`}>
                        <div className="question-header">
                          <div className="question-meta">
                            <span className={`status-badge ${item.status}`}>
                              {item.status === "answered" ? "Respondida" : "Pendiente"}
                            </span>
                            <span className="question-date">
                              <Clock size={14} />
                              {formatDate(item.date)}
                            </span>
                          </div>
                        </div>

                        <div className="question-content">
                          <h3>Pregunta:</h3>
                          <p>{item.question}</p>
                        </div>

                        {item.answer ? (
                          <div className="answer-content">
                            <h3>Respuesta del administrador:</h3>
                            <p>{item.answer}</p>
                          </div>
                        ) : (
                          <div className="pending-message">
                            <p>Esperando respuesta del administrador...</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={`page-footer ${loaded ? "loaded" : ""}`}>
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </div>
    </div>
  )
}

export default ContactoProfesor