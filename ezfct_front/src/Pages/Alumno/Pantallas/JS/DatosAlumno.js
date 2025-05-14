"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, MapPin, Calendar, GraduationCap, Briefcase, Award, Lightbulb } from "lucide-react"
import "../CSS/DatosAlumno.css"

const DatosEstudianteProfesor = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()
  const location = useLocation()

  // Aseguramos que student tenga valores predeterminados para evitar errores
  const student = {
    id: "",
    name: "Estudiante",
    school: "Escuela no especificada",
    location: "Ubicación no especificada",
    age: "N/A",
    education: "No especificada",
    occupation: "No especificada",
    techLiterate: "No especificada",
    competencies: "",
    image: "/placeholder.svg",
    ...location.state,
  }

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

  const handleGoBack = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setTimeout(() => navigate(-1), 300)
  }

  const handleAssignOffer = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")
    setTimeout(() => navigate("/profesores/Ofertas"), 300)
  }

  // Función para manejar competencias de forma segura
  const getCompetencies = () => {
    if (!student.competencies) return []
    return student.competencies.split(", ")
  }

  // Obtener la primera competencia de forma segura
  const getFirstCompetency = () => {
    const competencies = getCompetencies()
    return competencies.length > 0 ? competencies[0] : "áreas técnicas"
  }

  return (
    <div className="datos-estudiante-page">
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

      <div className="datos-estudiante-container">
        {/* Botón de volver */}
        <button className={`back-button ${loaded ? "loaded" : ""}`} onClick={handleGoBack}>
          <ArrowLeft size={20} />
          <span>Back to Students</span>
        </button>

        {/* Perfil del estudiante */}
        <div className="student-profile">
          {/* Cabecera del perfil */}
          <div className={`profile-header ${loaded ? "loaded" : ""}`}>
            <div className="profile-avatar">
              <img src={student.image || "/placeholder.svg"} alt={`${student.name}'s avatar`} className="avatar-img" />
            </div>
            <div className="profile-header-content">
              <h1 className="profile-name">{student.name}</h1>
              <div className="profile-meta">
                <div className="meta-item">
                  <GraduationCap size={18} />
                  <span>{student.school}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={18} />
                  <span>{student.location}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{student.age} years old</span>
                </div>
              </div>
            </div>
            <button className="assign-button" onClick={handleAssignOffer}>
              <Briefcase size={18} />
              <span>Assign to Offer</span>
            </button>
          </div>

          {/* Contenido del perfil */}
          <div className="profile-content">
            {/* Información detallada */}
            <div className={`profile-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.1s" }}>
              <h2 className="section-title">Student Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <h3 className="info-label">Education</h3>
                  <p className="info-value">{student.education}</p>
                </div>
                <div className="info-item">
                  <h3 className="info-label">Occupation</h3>
                  <p className="info-value">{student.occupation}</p>
                </div>
                <div className="info-item">
                  <h3 className="info-label">Tech Literacy</h3>
                  <p className="info-value">{student.techLiterate}</p>
                </div>
                <div className="info-item">
                  <h3 className="info-label">Location</h3>
                  <p className="info-value">{student.location}</p>
                </div>
              </div>
            </div>

            {/* Competencias */}
            <div className={`profile-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.2s" }}>
              <h2 className="section-title">
                <Award size={20} className="section-icon" />
                Competencies
              </h2>
              <div className="competencies-container">
                {getCompetencies().length > 0 ? (
                  getCompetencies().map((competency, index) => (
                    <div key={index} className="competency-item">
                      <Lightbulb size={16} className="competency-icon" />
                      <span>{competency}</span>
                    </div>
                  ))
                ) : (
                  <div className="competency-item">
                    <Lightbulb size={16} className="competency-icon" />
                    <span>No competencies listed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Historial académico (simulado) */}
            <div className={`profile-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.3s" }}>
              <h2 className="section-title">
                <GraduationCap size={20} className="section-icon" />
                Academic History
              </h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">High School Education</h3>
                    <p className="timeline-period">2022 - Present</p>
                    <p className="timeline-description">
                      Currently studying at {student.school} with focus on technical subjects.
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">Secondary Education</h3>
                    <p className="timeline-period">2018 - 2022</p>
                    <p className="timeline-description">Completed secondary education with excellent grades.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas y observaciones (simulado) */}
            <div className={`profile-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.4s" }}>
              <h2 className="section-title">Notes & Observations</h2>
              <div className="notes-container">
                <div className="note-item">
                  <p className="note-text">
                    {student.name} shows great potential in {getFirstCompetency()}. Recommended for internships that
                    focus on this area.
                  </p>
                  <p className="note-author">- Prof. Martinez</p>
                  <p className="note-date">May 10, 2025</p>
                </div>
                <div className="note-item">
                  <p className="note-text">
                    Has shown consistent improvement throughout the semester. Works well in team environments.
                  </p>
                  <p className="note-author">- Prof. Garcia</p>
                  <p className="note-date">April 22, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <footer className={`page-footer ${loaded ? "loaded" : ""}`}>
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </div>
    </div>
  )
}

export default DatosEstudianteProfesor
