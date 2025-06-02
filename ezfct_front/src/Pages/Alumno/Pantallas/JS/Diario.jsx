import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Save,
  Book,
  X,
  ArrowLeft,
  User,
  LogOut,
  Edit,
  ChevronDown,
} from "lucide-react"
import "../CSS/Diario.css"
import { API_URL } from "../../../../constants.js"

const DiarioAlumno = () => {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [diaryEntries, setDiaryEntries] = useState({})
  const [currentEntry, setCurrentEntry] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({
    nombre: "Jaydon",
    apellido: "Herwitz",
    email: "jaydon.herwitz@example.com",
    escuela: "Ins Puig Castellar",
    edad: 17,
    competencias: "Problem Solving, Critical Thinking",
    ubicacion: "Barcelona",
    nivelTecnico: "Alto",
  })
  const [practicaId, setPracticaId] = useState(null) // Add state for practica ID
  const [alumnoId, setAlumnoId] = useState(null) // Add state for alumno ID

  const modalRef = useRef(null)
  const textareaRef = useRef(null)
  const profileMenuRef = useRef(null)
  const profileButtonRef = useRef(null)
  const navigate = useNavigate()
  
  // Efecto para la animación de entrada y partículas
  useEffect(() => {
const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    // Mark as loaded for animations
    setTimeout(() => setLoaded(true), 100)

    // Create initial particles
    createInitialParticles()

    // Load user data (assuming you have an endpoint for this)
    fetchUserData(token)
    
    // Load diary entries
    fetchDiaryEntries(token)

    // Mouse tracking and other effects...
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

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && showModal) {
        closeModal()
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

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

    document.addEventListener("mousedown", handleClickOutsideProfileMenu)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu)
      clearInterval(interval)
    }
  }, [showModal, showProfileMenu])
  
  /*******************/
    const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/alumno`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (!response.ok) throw new Error("Failed to fetch user data")
      
      const userData = await response.json()
      setProfileData({
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        escuela: userData.escuela || "Ins Puig Castellar",
        edad: userData.edad || 17,
        competencias: userData.competencias || "Problem Solving, Critical Thinking",
        ubicacion: userData.ubicacion || "Barcelona",
        nivelTecnico: userData.nivelTecnico || "Alto",
      })
      
      if (userData.alumnoId) setAlumnoId(userData.alumnoId)
      if (userData.practicaId) setPracticaId(userData.practicaId)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const fetchDiaryEntries = async (token) => {
      try {
        const response = await fetch(`${API_URL}/api/diario/diarios`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error("Failed to fetch diary entries");
        
        const entries = await response.json();
        
        // Transform the array of entries into an object keyed by date
        const entriesByDate = entries.reduce((acc, entry) => {
          const date = new Date(entry.fecha);
          const dateKey = formatDateKey(
            date.getDate(),
            date.getMonth(),
            date.getFullYear()
          );
          acc[dateKey] = {
            id: entry.idDiario,
            resumen: entry.resumen,
            practicaId: entry.idPractica
          };
          return acc;
        }, {});
        
        setDiaryEntries(entriesByDate);
      } catch (error) {
        console.error("Error fetching diary entries:", error);
      }
  };

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
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e")
    setTimeout(() => navigate(-1), 300)
  }

  // Función para manejar el clic en el botón de perfil
  const handleProfileButtonClick = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6")
    setShowProfileMenu(!showProfileMenu)
  }

  // Función para navegar a la página de datos del alumno
  const handleNavigateToProfile = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981")
    setShowProfileMenu(false)
    setTimeout(() => navigate("/alumnos/datosAlumno"), 300)
  }

  // Función para obtener los días del mes actual
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Función para obtener el primer día de la semana del mes
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  // Función para generar los días del calendario
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

    const days = []

    // Días del mes anterior
    const daysInPrevMonth = getDaysInMonth(
      currentMonth - 1 < 0 ? 11 : currentMonth - 1,
      currentMonth - 1 < 0 ? currentYear - 1 : currentYear,
    )
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({
        day: daysInPrevMonth - adjustedFirstDay + i + 1,
        month: currentMonth - 1 < 0 ? 11 : currentMonth - 1,
        year: currentMonth - 1 < 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false,
      })
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
      })
    }

    // Días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length // 6 semanas * 7 días = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: currentMonth + 1 > 11 ? 0 : currentMonth + 1,
        year: currentMonth + 1 > 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false,
      })
    }

    return days
  }

  // Función para formatear la fecha como clave para el objeto diaryEntries
  const formatDateKey = (day, month, year) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  // Función para formatear la fecha para mostrar
  const formatDisplayDate = (day, month, year) => {
    const date = new Date(year, month, day)
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Función para manejar el clic en un día
  const handleDayClick = (day, month, year) => {
      const dateKey = formatDateKey(day, month, year);
      setSelectedDate({ day, month, year, dateKey });
      
      // Set current entry from diaryEntries or empty string
      setCurrentEntry(diaryEntries[dateKey]?.resumen || "");
      
      createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981");
      setShowModal(true);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 300);
  };

  // Función para cambiar de mes
  const changeMonth = (increment) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")

    let newMonth = currentMonth + increment
    let newYear = currentYear

    if (newMonth > 11) {
      newMonth = 0
      newYear += 1
    } else if (newMonth < 0) {
      newMonth = 11
      newYear -= 1
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  // Función para cerrar el modal
  const closeModal = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e")
    setShowModal(false)
    setSelectedDate(null)
  }

  // Función para guardar la entrada del diario
  const saveDiaryEntry = async () => {
    if (!selectedDate || !currentEntry.trim()) return;

    setIsSaving(true);
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981");

    try {
      // 1. Get profile data from localStorage
      const savedProfile = localStorage.getItem("profileData");
      if (!savedProfile) {
        throw new Error("No profile data found in localStorage");
      }
      
      const profileData = JSON.parse(savedProfile);
      
      // 2. Verify we have the required IDs
      if (!profileData.idPractica || !profileData.idAlumno) {
        throw new Error("Missing practice or student ID in profile data");
      }

      // 3. Format the date in ISO format (YYYY-MM-DD)
      const formattedDate = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}T00:00:00.000+00:00`;
      
      // 4. Get the token from localStorage
      const token = localStorage.getItem("token");
      
      // 5. Prepare the request body using IDs from localStorage
      const requestBody = {
        practica: { idPractica: profileData.idPractica }, 
        alumno: { idAlumno: profileData.idAlumno },
        resumen: currentEntry,
        fecha: formattedDate
      };

      // 6. Make the API call
      const response = await fetch(`${API_URL}/api/diario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error("Failed to save diary entry");
      }

      const savedEntry = await response.json();

      // 7. Update local state with the new entry
      setDiaryEntries(prev => ({
        ...prev,
        [selectedDate.dateKey]: currentEntry
      }));

      setIsSaving(false);
      closeModal();
    } catch (error) {
      console.error("Error saving diary entry:", error);
      setIsSaving(false);
      // Optionally show an error message to the user
    }
  };
  // Función para guardar los datos del perfil
  const saveProfileData = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6")

    // Guardar en localStorage
    localStorage.setItem("profileData", JSON.stringify(profileData))

    // Cerrar modal
    setShowProfileModal(false)
  }

  // Nombres de los meses
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  // Nombres de los días de la semana
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  // Verificar si un día tiene entrada en el diario
  const hasEntry = (day, month, year) => {
      const dateKey = formatDateKey(day, month, year);
      return diaryEntries[dateKey] && diaryEntries[dateKey].resumen;
  };

  // Verificar si un día es hoy
  const isToday = (day, month, year) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <div className="diario-page">
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

      <div className="diario-container">
        {/* Header */}
        <header className={`page-header ${loaded ? "loaded" : ""}`}>
          <div className="header-content">
            <h1 className="page-title">Mi Diario de Prácticas</h1>
            <p className="page-subtitle">Registra tus experiencias diarias durante tu periodo de prácticas</p>
          </div>
          <div className="header-gradient"></div>
        </header>

        {/* Contenido principal */}
        <div className={`diario-content ${loaded ? "loaded" : ""}`}>
          <div className="calendar-card">
            <div className="calendar-header">
              <button className="month-nav-button" onClick={() => changeMonth(-1)}>
                <span>←</span>
              </button>
              <h2 className="current-month">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button className="month-nav-button" onClick={() => changeMonth(1)}>
                <span>→</span>
              </button>
            </div>

            <div className="calendar-grid">
              {/* Días de la semana */}
              {weekDays.map((day, index) => (
                <div key={`weekday-${index}`} className="weekday">
                  {day}
                </div>
              ))}

              {/* Días del mes */}
              {generateCalendarDays().map((dayInfo, index) => (
                <div
                  key={`day-${index}`}
                  className={`calendar-day ${dayInfo.isCurrentMonth ? "" : "other-month"} ${
                    isToday(dayInfo.day, dayInfo.month, dayInfo.year) ? "today" : ""
                  } ${hasEntry(dayInfo.day, dayInfo.month, dayInfo.year) ? "has-entry" : ""}`}
                  onClick={() => handleDayClick(dayInfo.day, dayInfo.month, dayInfo.year)}
                >
                  <span className="day-number">{dayInfo.day}</span>
                  {hasEntry(dayInfo.day, dayInfo.month, dayInfo.year) && (
                    <div className="entry-indicator">
                      <Book size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="calendar-footer">
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-color today"></div>
                  <span>Hoy</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color has-entry"></div>
                  <span>Con entrada</span>
                </div>
              </div>
            </div>
          </div>

          <div className="instructions-card">
            <div className="instructions-header">
              <Calendar className="instructions-icon" size={24} />
              <h2>Cómo usar tu diario</h2>
            </div>
            <div className="instructions-content">
              <ol className="instructions-list">
                <li>Haz clic en cualquier día del calendario para añadir o editar una entrada.</li>
                <li>Escribe tus experiencias, aprendizajes o reflexiones del día.</li>
                <li>Haz clic en "Finalizar diario" para guardar tu entrada.</li>
                <li>Los días con entradas se marcarán con un indicador azul.</li>
                <li>Puedes volver a cualquier día para ver o editar tus entradas anteriores.</li>
              </ol>
              <div className="tip-box">
                <h3>Consejo:</h3>
                <p>
                  Mantener un diario regular te ayudará a reflexionar sobre tu progreso y aprendizaje durante tus
                  prácticas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menú de perfil flotante (fuera de su contenedor original) */}
        {showProfileMenu && (
          <div className="fixed-profile-menu" ref={profileMenuRef}>
            <button className="profile-menu-item" onClick={handleNavigateToProfile}>
              <User size={16} />
              <span>Ver perfil</span>
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

        {/* Modal para entrada del diario */}
        {showModal && selectedDate && (
          <div className="modal-overlay">
            <div className="modal-container diary-modal" ref={modalRef}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {formatDisplayDate(selectedDate.day, selectedDate.month, selectedDate.year)}
                </h2>
                <button className="close-button" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-content">
                <div className="diary-form">
                  <label htmlFor="diary-entry">Mi diario de hoy:</label>
                  <textarea
                    ref={textareaRef}
                    id="diary-entry"
                    className="diary-textarea"
                    placeholder="Escribe aquí tus experiencias, aprendizajes y reflexiones del día..."
                    value={currentEntry}
                    onChange={(e) => setCurrentEntry(e.target.value)}
                    rows={12}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-button" onClick={closeModal}>
                  Cancelar
                </button>
                <button className="save-button" onClick={saveDiaryEntry} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <span className="spinner"></span>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Finalizar diario</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición de perfil */}
        {showProfileModal && (
          <div className="modal-overlay">
            <div className="modal-container profile-modal" ref={modalRef}>
              <div className="modal-header">
                <h2 className="modal-title">Editar Perfil</h2>
                <button className="close-button" onClick={() => setShowProfileModal(false)}>
                  <X size={20} />
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
                      <label htmlFor="escuela">Escuela/Instituto</label>
                      <input
                        type="text"
                        id="escuela"
                        value={profileData.escuela}
                        onChange={(e) => setProfileData({ ...profileData, escuela: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edad">Edad</label>
                      <input
                        type="number"
                        id="edad"
                        value={profileData.edad}
                        onChange={(e) => setProfileData({ ...profileData, edad: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ubicacion">Ubicación</label>
                      <input
                        type="text"
                        id="ubicacion"
                        value={profileData.ubicacion}
                        onChange={(e) => setProfileData({ ...profileData, ubicacion: e.target.value })}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="competencias">Competencias</label>
                      <input
                        type="text"
                        id="competencias"
                        value={profileData.competencias}
                        onChange={(e) => setProfileData({ ...profileData, competencias: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="nivelTecnico">Nivel técnico</label>
                      <select
                        id="nivelTecnico"
                        value={profileData.nivelTecnico}
                        onChange={(e) => setProfileData({ ...profileData, nivelTecnico: e.target.value })}
                      >
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-button" onClick={() => setShowProfileModal(false)}>
                  Cancelar
                </button>
                <button className="save-button" onClick={saveProfileData}>
                  <Save size={18} />
                  <span>Guardar cambios</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pie de página */}
        <footer className={`page-footer ${loaded ? "loaded" : ""}`}>
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </div>
    </div>
  )
}

export default DiarioAlumno