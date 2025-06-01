import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Search, Filter, GraduationCap, User, LogOut, Edit, ChevronDown, UserPlus } from "lucide-react"
import "../CSS/AlumnosProfesor.css"
import { API_URL } from "../../../../constants"

const EstudiantesProfesor = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [students, setStudents] = useState([]) // Changed from static data to state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [profileData, setProfileData] = useState({
    nombre: "Prof. García",
    apellido: "Martínez",
    email: "garcia.martinez@instituto.edu",
    instituto: "Ins Puig Castellar",
    departamento: "Informática",
    experiencia: "15 años",
    especialidad: "Desarrollo Web",
  })

  const navigate = useNavigate()
  const profileMenuRef = useRef(null)
  const profileButtonRef = useRef(null)

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/alumnos`)
        if (!response.ok) {
          throw new Error('Failed to fetch students')
        }
        const data = await response.json()
        setStudents(data.map(student => ({
          id: student.idAlumno,
          name: student.usuario?.nombre || 'Nombre no disponible',
          school: "Ins Puig Castellar", // You might want to get this from student data
          age: student.edad || 'N/A',
          education: student.educacion || 'N/A',
          competencies: student.competencias || 'N/A',
          occupation: 'Student',
          location: 'Barcelona',
          techLiterate: student.nivelTecnico || 'N/A',
          image: "/usuario1.jpg",
          estadoPractica: student.estadoPractica || 'N/A',
          biografia: student.biografia || '',
          habilidades: student.habilidades || '',
          portfolio: student.portfolio || ''
        })))
      } catch (err) {
        setError(err.message)
        console.error('Error fetching students:', err)
      } finally {
        setIsLoading(false)
        setLoaded(true)
      }
    }

    fetchStudents()
  }, [])

  // Rest of your existing useEffect for animations
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
    createInitialParticles()

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

    const handleClickOutsideProfileMenu = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target) &&
        showProfileMenu
      ) {
        setShowProfileMenu(false)
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutsideProfileMenu)

    const savedProfile = localStorage.getItem("profesorProfileData")
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu)
      clearInterval(interval)
    }
  }, [showProfileMenu])

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

  // Función para manejar el clic en el botón de perfil
  const handleProfileButtonClick = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")
    setShowProfileMenu(!showProfileMenu)
  }

  // Función para navegar a crear alumno
  const handleNavigateToCreateStudent = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setShowProfileMenu(false)
    setTimeout(() => navigate("/profesores/crearAlumno"), 300)
  }

  // Función para guardar los datos del perfil
  const saveProfileData = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")
    localStorage.setItem("profesorProfileData", JSON.stringify(profileData))
    setShowProfileModal(false)
  }

  // Filtrar estudiantes según la búsqueda
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="estudiantes-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="estudiantes-page">
        <div className="error-container">
          <p>Error loading students: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    )
  }

return (
    <div className="estudiantes-page">
      {/* Particles container */}
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

      {/* Barra de navegación superior */}
      <nav className={`top-navbar ${loaded ? "loaded" : ""}`}>
        <div className="navbar-left">
          <button className="nav-button" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>
        </div>
        <div className="navbar-title">
          <h2>EasyFCT</h2>
        </div>
        <div className="navbar-right">
          <button ref={profileButtonRef} className="user-button" onClick={handleProfileButtonClick}>
            <User size={18} />
            <span className="user-name">{profileData.nombre}</span>
            <ChevronDown size={14} className={`user-chevron ${showProfileMenu ? "open" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Contenedor principal */}
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
          <button
            className="back-button"
            onClick={() => {
              createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
              setTimeout(() => navigate("/profesores/crearAlumno"), 300)
            }}
          >
            <UserPlus size={20} />
            <span>Create Student</span>
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

      {/* Menú de perfil flotante */}
      {showProfileMenu && (
        <div className="fixed-profile-menu" ref={profileMenuRef}>
          <button className="profile-menu-item" onClick={handleNavigateToCreateStudent}>
            <UserPlus size={16} />
            <span>Crear Alumno</span>
          </button>
          <button
            className="profile-menu-item"
            onClick={() => {
              createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
              setShowProfileMenu(false)
              setShowProfileModal(true)
            }}
          >
            <Edit size={16} />
            <span>Editar perfil</span>
          </button>
          <button
            className="profile-menu-item logout"
            onClick={() => {
              createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e")
              setTimeout(() => navigate("/"), 300)
            }}
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}

      {/* Modal de edición de perfil */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-container profile-modal">
            <div className="modal-header">
              <h2 className="modal-title">Editar Perfil</h2>
              <button className="close-button" onClick={() => setShowProfileModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="profile-form">
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      value={profileData.nombre}
                      onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                      type="text"
                      id="apellido"
                      value={profileData.apellido}
                      onChange={(e) => setProfileData({ ...profileData, apellido: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="instituto">Instituto</label>
                    <input
                      type="text"
                      id="instituto"
                      value={profileData.instituto}
                      onChange={(e) => setProfileData({ ...profileData, instituto: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="departamento">Departamento</label>
                    <input
                      type="text"
                      id="departamento"
                      value={profileData.departamento}
                      onChange={(e) => setProfileData({ ...profileData, departamento: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="especialidad">Especialidad</label>
                    <input
                      type="text"
                      id="especialidad"
                      value={profileData.especialidad}
                      onChange={(e) => setProfileData({ ...profileData, especialidad: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowProfileModal(false)}>
                Cancelar
              </button>
              <button className="save-button" onClick={saveProfileData}>
                <Edit size={18} />
                <span>Guardar cambios</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EstudiantesProfesor