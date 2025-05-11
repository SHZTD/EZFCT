"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Search, Filter, GraduationCap } from "lucide-react"
import "../CSS/AlumnosProfesor.css"

const EstudiantesProfesor = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  // Datos de estudiantes
  const students = [
    {
      id: 1,
      name: "Jaydon Herwitz",
      school: "Ins Puig Castellar",
      age: 17,
      education: "High School",
      competencies: "Problem Solving",
      occupation: "Student",
      location: "Barcelona",
      techLiterate: "High",
      image: "/usuario1.jpg",
    },
    {
      id: 2,
      name: "Giana Herwitz",
      school: "Ins Puig Castellar",
      age: 18,
      education: "High School",
      competencies: "Creativity, Teamwork",
      occupation: "Student",
      location: "Barcelona",
      techLiterate: "Medium",
      image: "/usuario2.jpg",
    },
    {
      id: 3,
      name: "Messi",
      school: "Ins Puig Castellar",
      age: 17,
      education: "High School",
      competencies: "Critical Thinking, Leadership",
      occupation: "Student",
      location: "Barcelona",
      techLiterate: "High",
      image: "/usuario3.png",
    },
    {
      id: 4,
      name: "Laura Sánchez",
      school: "Ins Puig Castellar",
      age: 18,
      education: "High School",
      competencies: "Communication, Organization",
      occupation: "Student",
      location: "Barcelona",
      techLiterate: "Medium",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      name: "Carlos Martínez",
      school: "Ins Puig Castellar",
      age: 17,
      education: "High School",
      competencies: "Analytical Thinking, Attention to Detail",
      occupation: "Student",
      location: "Barcelona",
      techLiterate: "High",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 6,
      name: "Ana García",
      school: "Ins Puig Castellar",
      age: 19,
      education: "High School",
      competencies: "Adaptability, Time Management",
      occupation: "Student",
      location: "Barcelona",
      techLiterate: "Medium",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

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
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    setTimeout(() => navigate(-1), 300)
  }

  const handleGoToStudent = (student) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setTimeout(() => {
      navigate("/profesores/datosAlumno", { state: student })
    }, 300)
  }

  // Filtrar estudiantes según la búsqueda
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="estudiantes-page">
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

      <div className="estudiantes-container">
        {/* Header */}
        <header className={`page-header ${loaded ? "loaded" : ""}`}>
          <div className="header-content">
            <h1 className="page-title">STUDENTS</h1>
            <p className="page-subtitle">Manage and assign students to internship opportunities</p>
          </div>
          <div className="header-gradient"></div>
        </header>

        {/* Botón de volver y barra de búsqueda */}
        <div className={`actions-container ${loaded ? "loaded" : ""}`}>
          <button className="back-button" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search students by name or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-button">
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Lista de estudiantes */}
        <div className={`students-list ${loaded ? "loaded" : ""}`}>
          {filteredStudents.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No students found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredStudents.map((student, index) => (
              <div
                key={student.id}
                className="student-card"
                onClick={() => handleGoToStudent(student)}
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="student-avatar">
                  <img
                    src={student.image || "/placeholder.svg"}
                    alt={`${student.name}'s avatar`}
                    className="avatar-img"
                  />
                </div>
                <div className="student-info">
                  <h2 className="student-name">{student.name}</h2>
                  <div className="student-meta">
                    <div className="meta-item">
                      <GraduationCap size={16} />
                      <span>{student.school}</span>
                    </div>
                    <div className="meta-tags">
                      <span className="meta-tag">Age: {student.age}</span>
                      <span className="meta-tag">{student.techLiterate}</span>
                    </div>
                  </div>
                  <p className="student-competencies">
                    <strong>Skills:</strong> {student.competencies}
                  </p>
                </div>
                <div className="card-arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pie de página */}
        <footer className={`page-footer ${loaded ? "loaded" : ""}`}>
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </div>
    </div>
  )
}

export default EstudiantesProfesor
