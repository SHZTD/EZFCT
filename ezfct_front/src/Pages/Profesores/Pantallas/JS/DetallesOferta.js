"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../CSS/DetallesOferta.css"
import { ArrowLeft, Calendar, MapPin, Users, Building, GraduationCap, Clock, Mail, Phone } from "lucide-react"
import ButtonComp from "../../../../Components/JSX/ButtonComp"

const OfertaDetalleProfesor = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [oferta, setOferta] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  // Datos simulados de ofertas
  const ofertas = [
    {
      id: 1,
      title: "Programmer Database",
      subtitle: "For students DAM",
      category: "programming",
      company: "TechSolutions",
      companyLogo: "https://via.placeholder.com/100",
      companyDescription:
        "TechSolutions is a leading technology company specializing in database solutions and cloud infrastructure.",
      location: "Madrid",
      address: "Calle Gran Vía 28, 28013 Madrid",
      date: "2025-04-15",
      startDate: "2025-05-01",
      endDate: "2025-07-30",
      students: 3,
      description:
        "We are looking for a talented database programmer to join our team for a 3-month internship. The candidate will work on designing, implementing, and optimizing database solutions for our enterprise clients. This is a great opportunity to gain hands-on experience in a professional environment.",
      requirements: [
        "Knowledge of SQL and relational databases",
        "Basic understanding of database design principles",
        "Familiarity with at least one programming language (Java, Python, etc.)",
        "Good problem-solving skills",
        "Ability to work in a team environment",
      ],
      contactPerson: "María García",
      contactEmail: "m.garcia@techsolutions.example",
      contactPhone: "+34 912 345 678",
    }
  ]

  // Efecto para la animación de entrada y partículas
  useEffect(() => {
    // Buscar la oferta por ID
    const ofertaEncontrada = ofertas.find((o) => o.id === Number.parseInt(id))
    setOferta(ofertaEncontrada)

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
  }, [id])

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

  const handleNavigateBack = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    setTimeout(() => navigate(-1), 300)
  }

  const handleNavigateToAssign = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setTimeout(() => navigate("/profesores/alumnos"), 300)
  }

  if (!oferta) {
    return (
      <div className="oferta-detalle-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading offer details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="oferta-detalle-page">
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

      <div className="oferta-detalle-container">
        {/* Botón de volver */}
        <button className={`back-button ${loaded ? "loaded" : ""}`} onClick={handleNavigateBack}>
          <ArrowLeft size={20} />
        </button>

        {/* Cabecera de la oferta */}
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
                <span>{oferta.company}</span>
              </div>
              <div className="meta-item">
                <MapPin size={16} />
                <span>{oferta.location}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>Posted: {oferta.date}</span>
              </div>
              <div className="meta-item">
                <Users size={16} />
                <span>{oferta.students} positions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="oferta-content">
          <div className="oferta-main">
            {/* Sección de descripción */}
            <section className={`oferta-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.1s" }}>
              <h2 className="section-title">Description</h2>
              <p className="section-text">{oferta.description}</p>
            </section>

            {/* Sección de requisitos */}
            <section className={`oferta-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.2s" }}>
              <h2 className="section-title">Requirements</h2>
              <ul className="requirements-list">
                {oferta.requirements.map((req, index) => (
                  <li key={index} className="requirement-item">
                    {req}
                  </li>
                ))}
              </ul>
            </section>

         
 {/* Información de la empresa */}
            <div className={`sidebar-card company-card ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.2s" }}>
              <h3 className="sidebar-title">Company Information</h3>
              <div className="company-info">
                <h4 className="company-name">{oferta.company}</h4>
                <p className="company-description">{oferta.companyDescription}</p>
                <div className="company-location">
                  <MapPin size={16} />
                  <span>{oferta.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar con información adicional */}
          <div className="oferta-sidebar">
              {/* Sección de periodo de prácticas */}
            <section className={`oferta-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.3s" }}>
              <h2 className="section-title">Internship Period</h2>
              <div className="period-info">
                <div className="period-item">
                  <Calendar size={16} />
                  <div>
                    <span className="period-label">Start Date</span>
                    <span className="period-value">{oferta.startDate}</span>
                  </div>
                </div>
                <div className="period-item">
                  <Calendar size={16} />
                  <div>
                    <span className="period-label">End Date</span>
                    <span className="period-value">{oferta.endDate}</span>
                  </div>
                </div>
                <div className="period-item">
                  <Clock size={16} />
                  <div>
                    <span className="period-label">Duration</span>
                    <span className="period-value">
                      {Math.round((new Date(oferta.endDate) - new Date(oferta.startDate)) / (1000 * 60 * 60 * 24 * 30))}{" "}
                      months
                    </span>
                  </div>
                </div>
              </div>
            </section>

  {/* Sección de información de contacto */}
            <section className={`oferta-section ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.4s" }}>
              <h2 className="section-title">Contact Information</h2>
              <div className="contact-info">
                <div className="contact-person">{oferta.contactPerson}</div>
                <div className="contact-item">
                  <Mail size={16} />
                  <a href={`mailto:${oferta.contactEmail}`} className="contact-value">
                    {oferta.contactEmail}
                  </a>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <a href={`tel:${oferta.contactPhone}`} className="contact-value">
                    {oferta.contactPhone}
                  </a>
                </div>
              </div>
            </section>
            {/* Botones de acción */}
            <div className={`action-buttons ${loaded ? "loaded" : ""}`} style={{ transitionDelay: "0.5s" }}>
              <ButtonComp text="Assign Student" icon={<GraduationCap size={18} />} onClick={handleNavigateToAssign} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfertaDetalleProfesor
