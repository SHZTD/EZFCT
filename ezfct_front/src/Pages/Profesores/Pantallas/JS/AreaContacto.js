import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Send, MessageSquare, X, ArrowLeft, Clock } from "lucide-react"
import "../CSS/AreaContacto.css"

const ContactoProfesor = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showModal, setShowModal] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionHistory, setQuestionHistory] = useState([
    {
      id: 1,
      question: "¿Cuándo comienza el periodo de prácticas?",
      answer: "El periodo de prácticas comienza el 15 de mayo de 2025 y finaliza el 30 de julio de 2025.",
      date: "2025-03-10T14:30:00",
      status: "answered",
    },
    {
      id: 2,
      question: "¿Puedo cambiar de empresa una vez asignada?",
      answer:
        "Sí, es posible cambiar de empresa si hay una razón justificada. Debes solicitarlo con al menos 2 semanas de antelación.",
      date: "2025-03-15T09:45:00",
      status: "answered",
    },
    {
      id: 3,
      question: "¿Cómo se evalúan las prácticas?",
      answer:
        "Las prácticas se evalúan mediante un informe del tutor de empresa (60%) y un trabajo final que debes presentar (40%).",
      date: "2025-03-20T16:15:00",
      status: "answered",
    },
  ])

  const navigate = useNavigate()
  const modalRef = useRef(null)
  const textareaRef = useRef(null)

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
      if (modalRef.current && !modalRef.current.contains(e.target) && showModal) {
        closeModal()
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
      clearInterval(interval)
    }
  }, [showModal])

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

  const openModal = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    setShowModal(true)
  }

  const closeModal = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e")
    setShowModal(false)
  }

  const handleSubmitQuestion = (e) => {
    e.preventDefault()

    if (!currentQuestion.trim()) return

    setIsSubmitting(true)
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")

    // Simular envío a backend
    setTimeout(() => {
      const newQuestion = {
        id: Date.now(),
        question: currentQuestion,
        answer: null,
        date: new Date().toISOString(),
        status: "pending",
      }

      setQuestionHistory((prev) => [newQuestion, ...prev])
      setCurrentQuestion("")
      setIsSubmitting(false)

      // Enfocar el textarea después de enviar
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 1000)
  }

  // Formatear fecha para mostrar
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

        {/* Contenido principal */}
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

        {/* Modal de respuestas */}
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
                {questionHistory.length === 0 ? (
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
                            <h3>Respuesta:</h3>
                            <p>{item.answer}</p>
                          </div>
                        ) : (
                          <div className="pending-message">
                            <p>Esperando respuesta...</p>
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

        {/* Pie de página */}
        <footer className={`page-footer ${loaded ? "loaded" : ""}`}>
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </div>
    </div>
  )
}

export default ContactoProfesor
