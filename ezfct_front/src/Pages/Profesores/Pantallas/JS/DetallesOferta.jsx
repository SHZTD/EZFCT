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
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  // Función para formatear la fecha
  const formatDate = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const calculateDuration = (startDateStr, endDateStr) => {
    try {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Invalid dates";
      }
  
      const diffMs = endDate - startDate;
      
      const months = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
      
      if (months < 1) {
        const weeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      }
      
      return `${months} month${months !== 1 ? 's' : ''}`;
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "Error calculating";
    }
  };

  // Efecto para cargar los datos de la oferta
  useEffect(() => {
    const fetchOferta = async () => {
      try {
        const response = await fetch(`${API_URL}/api/practicas/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        // Mapear los datos del backend al formato esperado por el componente
        const mappedOferta = {
          id: data.idPractica,
          title: data.titulo,
          subtitle: "Internship Opportunity", // Puedes ajustar esto según necesites
          category: data.modalidad, // Asumiendo que modalidad es un string
          company: data.empresa?.nombre || "Company Name", // Asegúrate de que empresa.nombre existe
          companyLogo: "https://via.placeholder.com/100", // Puedes añadir esto a tu modelo si lo necesitas
          companyDescription: data.empresa?.descripcion || "Company description", // Añade este campo a tu modelo Empresa si es necesario
          location: data.empresa?.ciudad || "City", // Añade ciudad a tu modelo Empresa
          address: data.empresa?.direccion || "Address", // Añade dirección a tu modelo Empresa
          date: formatDate(new Date()), // Fecha de publicación (puedes añadir este campo a tu modelo)
          startDate: formatDate(data.fechaInicio),
          endDate: formatDate(data.fechaFin),
          students: data.vacantes,
          description: data.descripcion,
          requirements: data.requisitos ? data.requisitos.split('\n') : [], // Asume que requisitos es un string con saltos de línea
          contactPerson: data.empresa?.contactoNombre || "Contact Person", // Añade estos campos a Empresa
          contactEmail: data.empresa?.contactoEmail || "contact@example.com",
          contactPhone: data.empresa?.contactoTelefono || "+34 000 000 000",
        }
        
        setOferta(mappedOferta)
        setTimeout(() => setLoaded(true), 100)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching offer:", err)
      }
    }

    fetchOferta()
    createInitialParticles()

    // Resto del código para las partículas y seguimiento del ratón
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

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [id])

  // Resto del código permanece igual...
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
          <p>Error loading offer: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    )
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

  // El resto del return permanece igual...
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
                      {oferta.startDate && oferta.endDate ? (
                        calculateDuration(oferta.startDate, oferta.endDate)
                      ) : (
                        "Not specified"
                      )}
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