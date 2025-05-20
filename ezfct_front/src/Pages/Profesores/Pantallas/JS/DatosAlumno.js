"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../CSS/DatosAlumno.css"

const DatosAlumno = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [bubbles, setBubbles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [student, setStudent] = useState(null)

  // Datos de ejemplo para estudiantes (en una aplicación real, esto vendría de una API)
  const studentsData = [
    {
      id: 1,
      name: "Jaydon Herwitz",
      time: "28 mins ago",
      avatar: "/usuario1.jpg",
      selected: false,
      role: "Frontend Developer",
      skills: ["JavaScript", "React", "CSS", "HTML"],
      education: "Desarrollo de Aplicaciones Web, Ins Puig Castellar",
      experience: "120 horas en TechSolutions Barcelona",
      email: "jaydon.herwitz@example.com",
      phone: "+34 612 345 678",
      location: "Barcelona",
      availability: "Disponible desde Junio 2025",
      portfolio: "https://jaydonherwitz.dev",
      bio: "Estudiante de desarrollo web con gran interés en tecnologías frontend. Busco oportunidades para aplicar mis conocimientos en React y mejorar mis habilidades en un entorno profesional.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      time: "45 mins ago",
      avatar: "/usuario2.jpg",
      selected: false,
      role: "UX/UI Designer",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      education: "Diseño Gráfico, Escuela de Arte",
      experience: "3 meses en Agencia Creativa",
      email: "sarah.johnson@example.com",
      phone: "+34 623 456 789",
      location: "Madrid",
      availability: "Disponible inmediatamente",
      portfolio: "https://sarahjohnson.design",
      bio: "Diseñadora creativa enfocada en crear experiencias de usuario hermosas y funcionales. Creo en el diseño que comunica claramente y deleita a los usuarios.",
    },
    {
      id: 3,
      name: "Alex Rivera",
      time: "1 hour ago",
      avatar: "/usuario3.png",
      selected: true,
      role: "Full Stack Developer",
      skills: ["JavaScript", "Python", "React", "Node.js", "MongoDB"],
      education: "Ingeniería Informática, Universidad Politécnica",
      experience: "200 horas en Tech Innovators",
      email: "alex.rivera@example.com",
      phone: "+34 634 567 890",
      location: "Valencia",
      availability: "Disponible desde Julio 2025",
      portfolio: "https://alexrivera.dev",
      bio: "Desarrollador full stack con pasión por construir aplicaciones web escalables. Disfruto enfrentando problemas complejos y aprendiendo nuevas tecnologías.",
    },
  ]

  // Efecto para cargar datos del estudiante
  useEffect(() => {
    const studentId = Number.parseInt(id) || 1
    const foundStudent = studentsData.find((s) => s.id === studentId)

    if (foundStudent) {
      setStudent(foundStudent)
    } else {
      // Si no se encuentra el estudiante, usar el primero por defecto
      setStudent(studentsData[0])
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

      <div className="da-student-info-container">
        {/* Botón de volver */}
        <button className={`da-back-button ${loaded ? "loaded" : ""}`} onClick={handleBackClick}>
          ← Volver
        </button>

        {/* Contenido principal */}
        <div className="da-info-content">
          {/* Panel lateral con foto y datos básicos */}
          <div className={`da-student-sidebar ${loaded ? "loaded" : ""}`}>
            <div className="da-profile-image-container">
              <img
                src={student.avatar || "/placeholder.svg?height=200&width=200"}
                alt={`${student.name}'s profile`}
                className="da-profile-image"
              />
            </div>

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
                Ir al Diario
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
              <h3 className="da-card-title">Biografía</h3>
              <p className="da-bio-text">{student.bio}</p>
            </div>

            {/* Sección de habilidades */}
            <div
              className={`da-detail-card da-skills-card ${loaded ? "loaded" : ""}`}
              style={{ transitionDelay: "0.1s" }}
            >
              <h3 className="da-card-title">Habilidades</h3>
              <div className="da-skills-container">
                {student.skills.map((skill, index) => (
                  <span key={index} className="da-skill-tag">
                    {skill}
                  </span>
                ))}
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
                <p className="da-detail-text">{student.experience}</p>
              </div>
            </div>

            {/* Sección de disponibilidad y portfolio */}
            <div className="da-details-row">
              <div
                className={`da-detail-card da-availability-card ${loaded ? "loaded" : ""}`}
                style={{ transitionDelay: "0.4s" }}
              >
                <h3 className="da-card-title">Disponibilidad</h3>
                <p className="da-detail-text">{student.availability}</p>
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
