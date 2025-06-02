"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../CSS/DetallesOferta.css"
import { ArrowLeft, Calendar, MapPin, Users, Building, GraduationCap, Clock, Mail, Phone } from "lucide-react"
import ButtonComp from "../../../../Components/JSX/ButtonComp"
import { API_URL } from "../../../../constants"

const OfertaDetalleProfesor = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [oferta, setOferta] = useState(null)
  const [empresa, setEmpresa] = useState({
    nombre: "Cargando...",
    direccion: "Cargando...",
    emailContacto: "Cargando...",
    telefono: "Cargando..."
  })
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  const formatDate = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleDateString('es-ES')
  }

  const calculateDuration = (startDateStr, endDateStr) => {
    try {
      const startDate = new Date(startDateStr)
      const endDate = new Date(endDateStr)

      if (isNaN(startDate.getTime())) return "Fecha inválida"
      if (isNaN(endDate.getTime())) return "Fecha inválida"

      const diffMs = endDate - startDate
      const months = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30))

      if (months < 1) {
        const weeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7))
        return `${weeks} semana${weeks !== 1 ? "s" : ""}`
      }

      return `${months} mes${months !== 1 ? "es" : ""}`
    } catch (error) {
      console.error("Error calculando duración:", error)
      return "Error en cálculo"
    }
  }

  useEffect(() => {
    const fetchOferta = async () => {
      try {
        const response = await fetch(`${API_URL}/api/practicas/${id}`)
        if (!response.ok) {
          throw new Error(`Error al cargar: ${response.status}`)
        }
        const data = await response.json()

        // Verificar si hay datos de empresa
        if (data.empresa) {
          setEmpresa({
            nombre: data.empresa.nombre || "No disponible",
            direccion: data.empresa.direccion || "No disponible",
            emailContacto: data.empresa.emailContacto || "No disponible",
            telefono: data.empresa.telefono || "No disponible"
          })
        }

        setOferta({
          id: data.idPractica,
          title: data.titulo,
          subtitle: "Oportunidad de Prácticas",
          category: data.modalidad,
          startDate: data.fechaInicio,
          endDate: data.fechaFin,
          students: data.vacantes,
          description: data.descripcion,
          requirements: data.requisitos ? data.requisitos.split(",") : [],
        })

        setTimeout(() => setLoaded(true), 100)
      } catch (err) {
        setError(err.message)
        console.error("Error:", err)
      }
    }

    fetchOferta()

    const createInitialParticles = () => {
      const newParticles = Array.from({ length: 50 }, () => ({
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * (window.innerWidth - 10),
        y: Math.random() * (window.innerHeight - 10),
        size: Math.random() * 5 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][Math.floor(Math.random() * 4)],
      }))
      setParticles(newParticles)
    }

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.pageX, y: e.pageY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    createInitialParticles()

    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY

          if (newX < 0) newX = window.innerWidth - particle.size
          if (newX > window.innerWidth - particle.size) newX = 0
          if (newY < 0) newY = window.innerHeight - particle.size
          if (newY > window.innerHeight - particle.size) newY = 0

          return {
            ...particle,
            x: newX,
            y: newY,
          }
        }),
      )
    }, 50)

    const handleResize = () => {
      createInitialParticles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [id])

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

  const handleNavigateBack = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    setTimeout(() => navigate(-1), 300)
  }

  const handleNavigateToAssign = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setTimeout(() => navigate("/profesores/alumnos"), 300)
  }

  if (error) {
    return (
      <div className="oferta-detalle-page">
        <div className="error-container">
          <p>Error al cargar: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    )
  }

  if (!oferta) {
    return (
      <div className="oferta-detalle-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando detalles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="oferta-detalle-page">
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

      <div className="oferta-detalle-container">
        <button className={`back-button ${loaded ? "loaded" : ""}`} onClick={handleNavigateBack}>
          <ArrowLeft size={20} />
        </button>

        <div className={`oferta-header ${loaded ? "loaded" : ""}`}>
          <div className="oferta-header-content">
            <div className="oferta-title-container">
              <h1 className="oferta-title">{oferta.title}</h1>
              <span className="oferta-category">{oferta.category}</span>
            </div>
            <p className="oferta-subtitle">{oferta.subtitle}</p>

            <div className="oferta-meta">
              <div className="meta-item">
                <Building size={16} />
                <span>{empresa.nombre}</span>
              </div>
              <div className="meta-item">
                <MapPin size={16} />
                <span>{empresa.direccion}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>Publicado: {formatDate(new Date())}</span>
              </div>
              <div className="meta-item">
                <Users size={16} />
                <span>{oferta.students} puesto{oferta.students !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="oferta-content">
          <div className="oferta-main">
            <section className={`oferta-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.1s" }}>
              <h2 className="section-title">Descripción</h2>
              <p className="section-text">{oferta.description}</p>
            </section>

            <section className={`oferta-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.2s" }}>
              <h2 className="section-title">Requisitos</h2>
              <ul className="requirements-list">
                {oferta.requirements.map((req, index) => (
                  <li key={index} className="requirement-item">
                    {req.trim()}
                  </li>
                ))}
              </ul>
            </section>

            <div className={`sidebar-card company-card ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.2s" }}>
              <h3 className="sidebar-title">Información de la Empresa</h3>
              <div className="company-info">
                <h4 className="company-name">{empresa.nombre}</h4>
                <div className="company-location">
                  <MapPin size={16} />
                  <span>{empresa.direccion}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="oferta-sidebar">
            <section className={`oferta-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.3s" }}>
              <h2 className="section-title">Periodo de Prácticas</h2>
              <div className="period-info">
                <div className="period-item">
                  <Calendar size={16} />
                  <div>
                    <span className="period-label">Inicio</span>
                    <span className="period-value">{formatDate(oferta.startDate)}</span>
                  </div>
                </div>
                <div className="period-item">
                  <Calendar size={16} />
                  <div>
                    <span className="period-label">Fin</span>
                    <span className="period-value">{formatDate(oferta.endDate)}</span>
                  </div>
                </div>
                <div className="period-item">
                  <Clock size={16} />
                  <div>
                    <span className="period-label">Duración</span>
                    <span className="period-value">
                      {oferta.startDate && oferta.endDate
                        ? calculateDuration(oferta.startDate, oferta.endDate)
                        : "No especificada"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className={`oferta-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.4s" }}>
              <h2 className="section-title">Contacto</h2>
              <div className="contact-info">
                <div className="contact-person">{empresa.nombre}</div>
                <div className="contact-item">
                  <Mail size={16} />
                  <a href={`mailto:${empresa.emailContacto}`} className="contact-value">
                    {empresa.emailContacto}
                  </a>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <a href={`tel:${empresa.telefono}`} className="contact-value">
                    {empresa.telefono}
                  </a>
                </div>
              </div>
            </section>

            <div className={`action-buttons ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.5s" }}>
              <ButtonComp 
                text="Asignar Alumno" 
                icon={<GraduationCap size={18} />} 
                onClick={handleNavigateToAssign} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfertaDetalleProfesor