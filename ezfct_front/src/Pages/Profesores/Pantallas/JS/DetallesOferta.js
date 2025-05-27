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
    },
    {
      id: 2,
      title: "UI Design",
      subtitle: "For students DAW",
      category: "design",
      company: "CreativeMinds",
      companyLogo: "https://via.placeholder.com/100",
      companyDescription:
        "CreativeMinds is an innovative design agency working with clients across various industries to create beautiful and functional digital experiences.",
      location: "Barcelona",
      address: "Avinguda Diagonal 211, 08018 Barcelona",
      date: "2025-04-20",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      students: 2,
      description:
        "Join our creative team as a UI Design intern and help us create stunning user interfaces for web and mobile applications. You'll work closely with our design team to create wireframes, prototypes, and final designs for real client projects.",
      requirements: [
        "Basic knowledge of design principles",
        "Familiarity with design tools (Figma, Adobe XD, etc.)",
        "Understanding of responsive design concepts",
        "Creative thinking and attention to detail",
        "Interest in user experience design",
      ],
      responsibilities: [
        "Create wireframes and prototypes",
        "Design user interface elements",
        "Collaborate with UX designers and developers",
        "Participate in design reviews and iterations",
        "Research design trends and best practices",
      ],
      benefits: [
        "Creative and inspiring work environment",
        "Portfolio-building opportunities",
        "Team lunches and social events",
        "Access to design resources and tools",
        "Central location in Barcelona",
      ],
      contactPerson: "Jordi Puig",
      contactEmail: "jordi@creativeminds.example",
      contactPhone: "+34 933 456 789",
    },
    {
      id: 3,
      title: "Interface Developer",
      subtitle: "For students DAW",
      category: "programming",
      company: "WebInnovate",
      companyLogo: "https://via.placeholder.com/100",
      companyDescription:
        "WebInnovate specializes in creating cutting-edge web applications and interfaces for clients in the technology and finance sectors.",
      location: "Valencia",
      address: "Carrer de Colón 58, 46004 Valencia",
      date: "2025-05-01",
      startDate: "2025-07-01",
      endDate: "2025-09-30",
      students: 1,
      description:
        "We're looking for a talented interface developer intern to join our team in Valencia. You'll be working on real client projects, implementing responsive and accessible user interfaces using modern web technologies.",
      requirements: [
        "Knowledge of HTML, CSS, and JavaScript",
        "Familiarity with at least one modern framework (React, Vue, etc.)",
        "Understanding of responsive design principles",
        "Basic knowledge of web accessibility standards",
        "Willingness to learn and adapt to new technologies",
      ],
      responsibilities: [
        "Implement user interfaces based on designs",
        "Write clean, maintainable code",
        "Test and debug across different browsers and devices",
        "Collaborate with designers and backend developers",
        "Participate in code reviews and team meetings",
      ],
      benefits: [
        "Flexible schedule",
        "Remote work options",
        "Professional development opportunities",
        "Modern office in central Valencia",
        "Team building activities",
      ],
      contactPerson: "Ana Martínez",
      contactEmail: "ana@webinnovate.example",
      contactPhone: "+34 962 345 678",
    },
    {
      id: 4,
      title: "Java programmer",
      subtitle: "For students DAM",
      category: "programming",
      company: "JavaTech",
      companyLogo: "https://via.placeholder.com/100",
      companyDescription:
        "JavaTech is a software development company specializing in enterprise Java applications for the banking and insurance sectors.",
      location: "Sevilla",
      address: "Avenida de la Constitución 20, 41004 Sevilla",
      date: "2025-05-10",
      startDate: "2025-06-15",
      endDate: "2025-09-15",
      students: 4,
      description:
        "Join our development team as a Java programming intern. You'll gain hands-on experience working with enterprise Java applications, learning about software architecture, and developing your programming skills in a professional environment.",
      requirements: [
        "Knowledge of Java programming fundamentals",
        "Understanding of object-oriented programming concepts",
        "Familiarity with basic data structures and algorithms",
        "Interest in enterprise software development",
        "Good problem-solving skills",
      ],
      responsibilities: [
        "Develop and maintain Java applications",
        "Write unit tests for code quality assurance",
        "Debug and fix issues in existing applications",
        "Participate in code reviews and team meetings",
        "Document code and technical specifications",
      ],
      benefits: [
        "Structured training program",
        "Mentorship from senior developers",
        "Exposure to enterprise-level projects",
        "Comfortable office in historic Sevilla",
        "Flexible working hours",
      ],
      contactPerson: "Carlos Ruiz",
      contactEmail: "c.ruiz@javatech.example",
      contactPhone: "+34 954 567 890",
    },
    {
      id: 5,
      title: "Laptop Technician",
      subtitle: "For students ASIX",
      category: "hardware",
      company: "HardwarePro",
      companyLogo: "https://via.placeholder.com/100",
      companyDescription:
        "HardwarePro is a leading IT services company providing hardware support, maintenance, and repair services to businesses and educational institutions.",
      location: "Bilbao",
      address: "Gran Vía de Don Diego López de Haro 45, 48011 Bilbao",
      date: "2025-05-15",
      startDate: "2025-07-01",
      endDate: "2025-10-01",
      students: 2,
      description:
        "We're looking for laptop technician interns to join our technical support team. You'll gain practical experience in diagnosing and repairing hardware issues, installing and configuring operating systems, and providing technical support to clients.",
      requirements: [
        "Basic knowledge of computer hardware components",
        "Understanding of operating systems (Windows, macOS)",
        "Problem-solving and troubleshooting skills",
        "Good customer service attitude",
        "Willingness to learn new technologies",
      ],
      responsibilities: [
        "Diagnose and repair hardware issues",
        "Install and configure operating systems and software",
        "Perform preventive maintenance on laptops and desktops",
        "Document repair procedures and inventory",
        "Provide technical support to clients",
      ],
      benefits: [
        "Hands-on technical experience",
        "Certification preparation assistance",
        "Exposure to various hardware and software technologies",
        "Modern facilities in central Bilbao",
        "Transportation allowance",
      ],
      contactPerson: "Miren Etxebarria",
      contactEmail: "miren@hardwarepro.example",
      contactPhone: "+34 944 567 890",
    },
    {
      id: 6,
      title: "Programmer Python",
      subtitle: "For students DAM",
      category: "programming",
      company: "DataScience Inc.",
      companyLogo: "https://via.placeholder.com/100",
      companyDescription:
        "DataScience Inc. specializes in data analysis, machine learning solutions, and AI-driven applications for businesses across various sectors.",
      location: "Málaga",
      address: "Calle Larios 15, 29005 Málaga",
      date: "2025-05-20",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      students: 3,
      description:
        "Join our data science team as a Python programming intern. You'll work on real-world data analysis projects, learn about machine learning algorithms, and develop your programming skills in a collaborative environment.",
      requirements: [
        "Knowledge of Python programming basics",
        "Interest in data analysis and machine learning",
        "Familiarity with libraries like NumPy, Pandas (a plus)",
        "Basic understanding of statistics",
        "Problem-solving mindset and attention to detail",
      ],
      contactPerson: "Laura Sánchez",
      contactEmail: "laura@datascience.example",
      contactPhone: "+34 951 234 567",
    },
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

      {/* Efecto de luz que sigue al cursor */}
      <div
        className="cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

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
