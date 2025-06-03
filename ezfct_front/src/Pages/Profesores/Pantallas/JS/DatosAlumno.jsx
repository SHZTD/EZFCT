import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { API_URL } from "../../../../constants"
import "../CSS/DatosAlumno.css"

const DatosAlumno = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [loaded, setLoaded] = useState(false)
  const [bubbles, setBubbles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [student, setStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para crear burbujas iniciales (en lugar de partículas)
  const createInitialBubbles = () => {
    const newBubbles = Array.from({ length: 30 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight, // Empiezan debajo de la pantalla
      size: Math.random() * 30, // Burbujas más grandes
      speedX: (Math.random() - 0.5) * 1, // Movimiento horizontal lento
      speedY: Math.random() * 1 + 0.5, // Movimiento vertical hacia arriba
      opacity: Math.random() * 0.3 + 0.1,
      // Colores más cálidos para cambiar la vibe
      color: ["#f97316", "#f59e0b", "#84cc16", "#10b981"][Math.floor(Math.random() * 4)],
    }))

    setBubbles(newBubbles)
  }

  // Función para crear efecto de explosión de burbujas
  const createBubbleEffect = (x, y, color) => {
    const explosionBubbles = Array.from({ length: 10 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      size: Math.random() * 20,
      speedX: (Math.random() - 0.5) * 3,
      speedY: Math.random() * 3 + 1,
      opacity: 0.7,
      color,
    }))

    setBubbles((prev) => [...prev, ...explosionBubbles])

    // Eliminar burbujas de explosión después de un tiempo
    setTimeout(() => {
      setBubbles((prev) => prev.slice(0, 30))
    }, 2000)
  }

  // Efecto para cargar datos del estudiante
  useEffect(() => {
    if (location.state?.student) {
      setStudent(location.state.student)
      setIsLoading(false)
      setTimeout(() => setLoaded(true), 100)
    } else {
      // Fetch student data if not passed via state
      const fetchStudent = async () => {
        try {
          const response = await fetch(`${API_URL}/api/alumnos/${id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch student data')
          }
          const data = await response.json()
          console.log(data)
          setStudent({
            id: data.idAlumno,
            name: data.usuario?.nombre || 'Nombre no disponible',
            role: "Estudiante",
            skills: data.competencias ? data.competencias.split(',').map(s => s.trim()) : [],
            education: data.educacion || 'No especificado',
            experience: data.experiencia || 'Sin experiencia registrada',
            email: data.usuario?.email || 'No disponible',
            phone: data.usuario?.telefono || 'No disponible',
            location: 'Barcelona', // You might want to get this from student data
            availability: data.estadoPractica || 'No disponible',
            portfolio: data.portfolio || '#',
            bio: data.biografia || 'No hay biografía disponible',

          })
        } catch (err) {
          setError(err.message)
          console.error('Error fetching student:', err)
        } finally {
          setIsLoading(false)
          setTimeout(() => setLoaded(true), 100)
        }
      }

      fetchStudent()
    }

    createInitialBubbles()

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    const interval = setInterval(() => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => ({
          ...bubble,
          x: bubble.x + bubble.speedX,
          y: bubble.y - bubble.speedY,
          ...(bubble.y < -50
            ? {
                y: window.innerHeight + 50,
                x: Math.random() * window.innerWidth,
              }
            : {}),
        })),
      )
    }, 50)

    const handleResize = () => {
      createInitialBubbles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [id, location.state])

  if (isLoading) {
    return (
      <div className="da-loading-screen">
        <div className="da-loading-container">
          <div className="da-spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="da-loading-screen">
        <div className="da-error-container">
          <p>Error al cargar los datos: {error}</p>
          <button onClick={() => window.location.reload()}>Intentar de nuevo</button>
        </div>
      </div>
    )
  }

  // Función para volver a la página anterior
  const handleBackClick = () => {
    createBubbleEffect(mousePosition.x, mousePosition.y, "#84cc16")
    setTimeout(() => {
      navigate(-1)
    }, 300)
  }

  if (!student) {
    return (
      <div className="da-loading-screen">
        <div className="da-loading-container">
          <div className="da-spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="da-student-info-page">
      {/* Burbujas de fondo */}
      <div className="da-bubbles-container">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="da-bubble"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: bubble.color,
              opacity: bubble.opacity,
            }}
          />
        ))}
      </div>

      {/* Botón de volver */}
      <button className={`da-back-button ${loaded ? "loaded" : ""}`} onClick={handleBackClick}>
        ← Volver
      </button>

      <div className="da-student-info-container">
        {/* Contenido principal */}
        <div className="da-info-content">
          {/* Panel lateral con foto y datos básicos */}
          <div className={`da-student-sidebar ${loaded ? "loaded" : ""}`}>
            <h2 className="da-student-name">{student.name}</h2>
            <p className="da-student-role">{student.role}</p>

            <div className="da-contact-info">
              <div className="da-contact-item">
                <span className="da-contact-icon">✉️</span>
                <span>{student.email}</span>
              </div>
              <div className="da-contact-item">
                <span className="da-contact-icon">📱</span>
                <span>{student.phone}</span>
              </div>
              <div className="da-contact-item">
                <span className="da-contact-icon">📍</span>
                <span>{student.location}</span>
              </div>
            </div>

            <div className="da-action-buttons">
              <button className="da-action-button da-primary">
                <span className="da-button-icon">📝</span>
                Asignar alumno
              </button>
              <button className="da-action-button da-secondary">
                <span className="da-button-icon">⭐</span>
                Ver Ofertas
              </button>
            </div>
          </div>

          {/* Panel principal con información detallada */}
          <div className="da-student-details">
            {/* Sección de biografía */}
            <div className={`da-detail-card da-bio-card ${loaded ? "loaded" : ""}`}>
              <h3 className="da-card-title">Sobre mí</h3>
              <p className="da-bio-text">Estudiante de desarrollo web con gran interés en tecnologías frontend. Busco oportunidades para aplicar mis conocimientos en React y mejorar mis habilidades en un entorno profesional.</p>
            </div>

            {/* Sección de habilidades */}
              <div
                className={`da-detail-card da-skills-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.1s" }}
              >
                <h3 className="da-card-title">Habilidades</h3>
                <div className="da-skills-container">
                  {(student.skills || []).length > 0 ? (
                    (student.skills || []).map((skill, index) => (
                      <span key={index} className="da-skill-tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="da-no-skills">No hay habilidades registradas</p>
                  )}
                </div>
              </div>
            {/* Sección de educación y experiencia */}
            <div className="da-details-row">
              <div
                className={`da-detail-card da-education-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.2s" }}
              >
                <h3 className="da-card-title">Educación</h3>
                <p className="da-detail-text">{student.education}</p>
              </div>

              <div
                className={`da-detail-card da-experience-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.3s" }}
              >
                <h3 className="da-card-title">Experiencia</h3>
                <p className="da-detail-text">Sin experiencia previa.</p>
              </div>
            </div>

            {/* Sección de disponibilidad y portfolio */}
            <div className="da-details-row">
              <div
                className={`da-detail-card da-availability-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.4s" }}
              >
                <h3 className="da-card-title">Disponibilidad</h3>
                <p className="da-detail-text">Disponibilidad inmediata</p>
              </div>

              <div
                className={`da-detail-card da-portfolio-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.5s" }}
              >
                <h3 className="da-card-title">Portfolio</h3>
                <a href={student.portfolio} target="_blank" rel="noopener noreferrer" className="da-portfolio-link">
                  <span className="da-link-icon">🔗</span>
                  Ver portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="da-footer">
          <p className={loaded ? "loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  )
}

export default DatosAlumno