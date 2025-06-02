"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import NavTabs from "../../../../Components/JSX/NavTabs.jsx"
import paperIcon from "../../../Imagenes/paper.png"
import usersIcon from "../../../Imagenes/users.png"
import "../CSS/InfoEstudiante.css"
import { User, UserRound, UserCircle } from "lucide-react"
import { API_URL } from "../../../../constants.js"

const InfoEstudiante = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("students")
  const [bubbles, setBubbles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [student, setStudent] = useState(null)
  // Eliminar studentsData mock y añadir estado para loading y error
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to get random user icon based on ID
  const getUserIcon = (id, className = "profile-image") => {
    const randomNum = id % 3
    const iconProps = {
      className: className,
      style: { width: "100%", height: "100%", color: "#6b7280" },
    }

    switch (randomNum) {
      case 0:
        return <User {...iconProps} />
      case 1:
        return <UserRound {...iconProps} />
      case 2:
        return <UserCircle {...iconProps} />
      default:
        return <User {...iconProps} />
    }
  }

  // Datos de ejemplo para estudiantes (en una aplicación real, esto vendría de una API)

  // Función para obtener datos del estudiante desde el backend
  const fetchStudentData = async (studentId) => {              
    setIsLoading(true)
    setError(null)
    try {
      // Primero obtener datos de la postulación
      const postulacionResponse = await fetch(`${API_URL}/api/postulaciones/${studentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!postulacionResponse.ok) {
        if (postulacionResponse.status === 404) {
          setError("Estudiante no encontrado")
        } else {
          throw new Error("Failed to fetch student data")
        }
        return // Exit the function if there's an error
      }

      const postulacionData = await postulacionResponse.json()

      // Formatear los datos para el componente
      const studentData = {
        id: postulacionData.idPostulacion,
        name: `${postulacionData.nombre} ${postulacionData.apellido}`,
        role: "Estudiante",
        skills: postulacionData.habilidades ? postulacionData.habilidades.split(",").map((s) => s.trim()) : [],
        education: postulacionData.educacion || "No especificado",
        experience: "Estudiante en prácticas",
        email: postulacionData.email,
        phone: "No especificado",
        location: "España",
        availability: "Disponible para prácticas",
        portfolio: "#",
        bio: postulacionData.biografia || "Sin biografía disponible",
      }

      setStudent(studentData)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching student data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Efecto para cargar datos del estudiante
  useEffect(() => {
    const studentId = id // Ya viene como string de useParams

    if (studentId) {
      fetchStudentData(studentId)
    } else {
      navigate("/empresas/Estudiantes")
    }

    // Marcar como cargado para iniciar animaciones
    setTimeout(() => setLoaded(true), 100)

    // Crear burbujas iniciales
    createInitialBubbles()

    // Seguimiento del ratón
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Intervalo para animar burbujas
    const interval = setInterval(() => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => ({
          ...bubble,
          x: bubble.x + bubble.speedX,
          y: bubble.y - bubble.speedY, // Las burbujas suben
          // Si la burbuja sale de la pantalla, la reposicionamos abajo
          ...(bubble.y < -50
            ? {
                y: window.innerHeight + 50,
                x: Math.random() * window.innerWidth,
              }
            : {}),
        })),
      )
    }, 50)

    // Ajustar burbujas al cambiar el tamaño de la ventana
    const handleResize = () => {
      createInitialBubbles()
    }

    window.addEventListener("resize", handleResize)

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [id, navigate])

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

  // Función para manejar el cambio de pestaña
  const handleTabChange = (tabKey, route) => {
    // Efecto de explosión de burbujas
    createBubbleEffect(mousePosition.x, mousePosition.y, "#f97316")

    if (route) {
      setTimeout(() => {
        navigate(route)
      }, 300)
    } else {
      setActiveTab(tabKey)
    }
  }

  // Función para volver a la página de estudiantes
  const handleBackClick = () => {
    createBubbleEffect(mousePosition.x, mousePosition.y, "#84cc16")
    setTimeout(() => {
      navigate("/empresas/Estudiantes")
    }, 300)
  }

  // Configuración de las pestañas
  const tabs = [
    { key: "offers", label: "Offers", icon: paperIcon, route: "/empresas/OfertasE" },
    { key: "students", label: "Students", icon: usersIcon, route: "/empresas/Estudiantes" },
  ]

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando información del estudiante...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <p>Error: {error}</p>
          <button onClick={() => navigate("/empresas/Estudiantes")}>Volver a Estudiantes</button>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="student-info-page">
      {/* Burbujas de fondo */}
      <div className="bubbles-container">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble"
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

      {/* Efecto de luz que sigue al cursor */}
      <div
        className="cursor-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Botón de volver */}
      <button className={`back-button ${loaded ? "loaded" : ""}`} onClick={handleBackClick}>
        ← Volver
      </button>

      <div className="student-info-container">
        {/* Navigation Tabs usando el componente NavTabs */}
        <NavTabs activeTab={activeTab} loaded={loaded} tabs={tabs} onTabChange={handleTabChange} />

        {/* Contenido principal */}
        <div className="info-content">
          {/* Panel lateral con foto y datos básicos */}
          <div className={`student-sidebar ${loaded ? "loaded" : ""}`}>
            <div className="profile-image-container">{getUserIcon(student.id)}</div>

            <h2 className="student-name">{student.name}</h2>
            <p className="student-role">{student.role}</p>

            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>{student.email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span>{student.phone}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>{student.location}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-button primary">
                <span className="button-icon">📩</span>
                Contactar
              </button>
              <button className="action-button secondary">
                <span className="button-icon">⭐</span>
                Guardar
              </button>
            </div>
          </div>

          {/* Panel principal con información detallada */}
          <div className="student-details">
            {/* Sección de biografía */}
            <div className={`detail-card bio-card ${loaded ? "loaded" : ""}`}>
              <h3 className="card-title">Biografía</h3>
              <p className="bio-text">{student.bio}</p>
            </div>

            {/* Sección de habilidades */}
            <div className={`detail-card skills-card ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.1s" }}>
              <h3 className="card-title">Habilidades</h3>
              <div className="skills-container">
                {student.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Sección de educación y experiencia */}
            <div className="details-row">
              <div
                className={`detail-card education-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.2s" }}
              >
                <h3 className="card-title">Educación</h3>
                <p className="detail-text">{student.education}</p>
              </div>

              <div
                className={`detail-card experience-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.3s" }}
              >
                <h3 className="card-title">Experiencia</h3>
                <p className="detail-text">{student.experience}</p>
              </div>
            </div>

            {/* Sección de disponibilidad y portfolio */}
            <div className="details-row">
              <div
                className={`detail-card availability-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.4s" }}
              >
                <h3 className="card-title">Disponibilidad</h3>
                <p className="detail-text">{student.availability}</p>
              </div>

              <div
                className={`detail-card portfolio-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.5s" }}
              >
                <h3 className="card-title">Portfolio</h3>
                <a href={student.portfolio} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                  <span className="link-icon">🔗</span>
                  Ver portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p className={loaded ? "loaded" : ""}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  )
}

export default InfoEstudiante
