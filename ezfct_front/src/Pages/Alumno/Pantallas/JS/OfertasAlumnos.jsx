import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  User,
  LogOut,
  ChevronDown,
  Building,
  Calendar,
  Send,
  Eye,
  X,
  Edit,
} from "lucide-react";
import "../CSS/OfertasAlumnos.css";
import { API_URL } from "../../../../constants.js";

const OfertasAlumnos = () => {
  const [loaded, setLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    idUsuario: null,
    idAlumno: null,
    nombre: "",
    apellido: "",
    email: "",
    escuela: "",
    edad: 20,
    competencias: "",
    ubicacion: "",
    nivelTecnico: "",
    habilidades: [],
    preferencias: [],
    idPractica: null
  });

  const [ofertas, setOfertas] = useState([]);

  const modalRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all internship offers
  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/practicas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch offers');
      
      const data = await response.json();
      
      // Only calculate matches if we have a student ID
      if (profileData.idAlumno) {
        const offersWithMatches = await Promise.all(
          data.map(async offer => {
            try {
              const matchResponse = await fetch(
                `${API_URL}/api/alumnos/${profileData.idAlumno}/match/practica/${offer.idPractica}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
              );
              
              if (matchResponse.ok) {
                const matchData = await matchResponse.json();
                return {
                  ...offer,
                  matched: matchData.matchPercentage > 70,
                  matchPercentage: matchData.matchPercentage
                };
              }
              return offer;
            } catch (err) {
              console.error("Error calculating match:", err);
              return offer;
            }
          })
        );
        setOfertas(offersWithMatches);
      } else {
        setOfertas(data);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  // Fetch student's applied offers
const fetchAppliedOffers = async () => {
    if (!profileData.idAlumno) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/postulaciones/alumno/${profileData.idAlumno}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAppliedOffers(data.map(post => post.practica.idPractica));
      }
    } catch (err) {
      console.error("Error fetching applied offers:", err);
    }
  };

  // Apply to an offer
  const applyToOffer = async (offerId) => {
    if (!profileData.idAlumno) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/postulaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alumno: { idAlumno: profileData.idAlumno },
          practica: { idPractica: offerId },
          estado: "PENDIENTE",
          fechaPostulacion: new Date()
        }),
      });

      if (response.ok) {
        setAppliedOffers([...appliedOffers, offerId]);
        createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981");
      } else {
        throw new Error("Failed to apply to offer");
      }
    } catch (err) {
      console.error("Error applying to offer:", err);
    }
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // 1. Get user data
      const userResponse = await fetch(`${API_URL}/api/usuarios/current`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      const userData = await userResponse.json();

      // 2. Get student data
      const alumnoResponse = await fetch(`${API_URL}/api/alumnos/by-user/${userData.idUsuario}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!alumnoResponse.ok) throw new Error('Failed to fetch student data');
      const alumnoData = await alumnoResponse.json();

      // 3. Get all applications for this student
      const postulacionesResponse = await fetch(
        `${API_URL}/api/postulaciones/alumno/${alumnoData.idAlumno}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      let idPracticaAceptada = null;
      if (postulacionesResponse.ok) {
        const postulaciones = await postulacionesResponse.json();
        // Find the accepted application
        const practicaAceptada = postulaciones.find(p => p.estado === "ACEPTADA");
        idPracticaAceptada = practicaAceptada?.practica?.idPractica || null;
      }

      // 4. Set complete profile data
      const newProfileData = {
        idUsuario: userData.idUsuario,
        idAlumno: alumnoData.idAlumno,
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        email: userData.email || "",
        escuela: alumnoData.educacion || "",
        edad: alumnoData.edad || 0,
        competencias: alumnoData.competencias || "",
        ubicacion: userData.ubicacion || "",
        nivelTecnico: alumnoData.nivelTecnico || "",
        habilidades: alumnoData.competencias ? 
          alumnoData.competencias.split(',').map(s => s.trim()) : [],
        preferencias: alumnoData.preferencias ? 
          alumnoData.preferencias.split(',').map(s => s.trim()) : [],
        idPractica: idPracticaAceptada
      };

      setProfileData(newProfileData);
      localStorage.setItem("profileData", JSON.stringify(newProfileData));
      
      return true;
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
  const initialize = async () => {
      setLoading(true);
      try {
        const profileSuccess = await fetchProfileData();
        
        if (!profileSuccess) {
          throw new Error("Failed to load profile data");
        }

        await Promise.all([
          fetchOffers(),
          fetchAppliedOffers()
        ]);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();

    // Mark as loaded for animations
    setTimeout(() => setLoaded(true), 100);
    createInitialParticles();

    // Seguimiento del ratón
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.pageX, y: e.pageY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Intervalo para animar partículas
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x:
            (particle.x + particle.speedX + window.innerWidth) %
            window.innerWidth,
          y:
            (particle.y + particle.speedY + window.innerHeight) %
            window.innerHeight,
        }))
      );
    }, 50);

    // Ajustar partículas al cambiar el tamaño de la ventana
    const handleResize = () => {
      createInitialParticles();
    };

    // Cerrar modal al hacer clic fuera
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        (showOfferModal || showProfileModal)
      ) {
        setShowOfferModal(false);
        setShowProfileModal(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }

    // Cerrar menú de perfil al hacer clic fuera
    const handleClickOutsideProfileMenu = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(e.target) &&
        showProfileMenu
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideProfileMenu);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideProfileMenu);
      clearInterval(interval);
    };
  }, [showOfferModal, showProfileModal, showProfileMenu]);

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
      color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][
        Math.floor(Math.random() * 4)
      ],
    }));

    setParticles(newParticles);
  };

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
    }));

    setParticles((prev) => [...prev, ...explosionParticles]);

    // Eliminar partículas de explosión después de un tiempo
    setTimeout(() => {
      setParticles((prev) => prev.slice(0, 50));
    }, 1000);
  };

  const handleGoBack = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f43f5e");
    setTimeout(() => navigate(-1), 300);
  };

  // Función para manejar el clic en el botón de perfil
  const handleProfileButtonClick = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6");
    setShowProfileMenu(!showProfileMenu);
  };

  // Función para navegar a la página de datos del alumno
  const handleNavigateToProfile = () => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981");
    setShowProfileMenu(false);
    setTimeout(() => navigate("/alumnos/datosAlumno"), 300);
  };

  // Función para mostrar detalles de oferta
  const handleShowOfferDetails = (offer) => {
    createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6");
    setSelectedOffer(offer);
    setShowOfferModal(true);
  };

  // Función para postularse a una oferta
  const handleApplyToOffer = (offerId) => {
    if (!appliedOffers.includes(offerId)) {
      applyToOffer(offerId);
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "Duración no especificada";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    return diffMonths <= 0 ? "1 mes" : `${diffMonths} meses`;
  };

  const formatOffer = (offer) => ({
    id: offer.idPractica,
    titulo: offer.titulo,
    empresa: offer.empresa?.nombre || "Empresa no especificada",
    ubicacion: offer.empresa?.ubicacion || "Madrid",
    tipo: offer.modalidad || "No especificado",
    duracion: calculateDuration(offer.fechaInicio, offer.fechaFin),
    descripcion: offer.descripcion || "No hay descripción disponible",
    requisitos: offer.requisitos?.split(",").map((s) => s.trim()) || [],
    fechaPublicacion: offer.fechaCreacion || new Date().toISOString(),
    fechaLimite:
      offer.fechaFin ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    matched: offer.matched || false,
    matchPercentage: offer.matchPercentage || 0,
  });

  const offersPerPage = 3;
  const totalPages = Math.ceil(ofertas.length / offersPerPage);
  const startIndex = (currentPage - 1) * offersPerPage;
  const currentOffers = ofertas
    .slice(startIndex, startIndex + offersPerPage)
    .map(formatOffer);

  // Función para cambiar página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    createExplosionEffect(window.innerWidth / 2, 100, "#8b5cf6");
  };

  // Función para guardar los datos del perfil
  const saveProfileData = async () => {
    try {
      if (!profileData.idAlumno || !profileData.idUsuario) {
        throw new Error("User or student ID missing - please refresh the page");
      }

      createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6");
      const token = localStorage.getItem("token");
      console.log("primer post hecho")
      const alumnoResponse = await fetch(
        `${API_URL}/api/alumnos/${profileData.idAlumno}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            educacion: profileData.escuela,
            competencias: profileData.competencias,
            habilidades: profileData.habilidades.join(","),
            biografia: "",
            experiencia: "",
            disponibilidad: "",
            portfolio: "",
          }),
        }
      );

      if (!alumnoResponse.ok) {
        const error = await alumnoResponse.json();
        throw new Error(error.message || "Failed to update student profile");
      }


      const updatedProfile = { ...profileData };
      localStorage.setItem("profileData", JSON.stringify(updatedProfile));
      setShowProfileModal(false);

      // 4. Show success and refresh
      alert("Profile updated successfully!");
      await fetchProfileData();
    } catch (err) {
      console.error("Save error:", err);
      alert(`Save failed: ${err.message}`);
    }
  };

  return (
    <div className="oa-ofertas-page">
      {/* Loading state */}
      {loading && (
        <div className="oa-loading-overlay">
          <div className="oa-loading-spinner"></div>
          <p>Cargando ofertas...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="oa-error-message">
          <p>Error al cargar las ofertas: {error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchOffers();
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Barra de navegación superior */}
      <nav className={`oa-top-navbar ${loaded ? "oa-loaded" : ""}`}>
        <div className="oa-navbar-left">
          <button className="oa-nav-button" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>
        </div>
        <div className="oa-navbar-title">
          <h2>EasyFCT</h2>
        </div>
        <div className="oa-navbar-right">
          <button
            ref={profileButtonRef}
            className="oa-user-button"
            onClick={handleProfileButtonClick}
          >
            <User size={18} />
            <span className="oa-user-name">{profileData.nombre}</span>
            <ChevronDown
              size={14}
              className={`oa-user-chevron ${showProfileMenu ? "oa-open" : ""}`}
            />
          </button>
        </div>
      </nav>

      <div className="oa-ofertas-container">
        {/* Header */}
        <header className={`oa-page-header ${loaded ? "oa-loaded" : ""}`}>
          <div className="oa-header-content">
            <h1 className="oa-page-title">Ofertas de Prácticas</h1>
            <p className="oa-page-subtitle">
              Encuentra la práctica perfecta que se adapte a tu perfil y
              preferencias
            </p>
          </div>
          <div className="oa-header-gradient"></div>
        </header>

        {/* Contenido principal */}
        <div className={`oa-ofertas-content ${loaded ? "oa-loaded" : ""}`}>
          {/* Estadísticas */}
          <div className="oa-stats-section">
            <div className="oa-stat-card">
              <div className="oa-stat-icon">
                <Briefcase size={24} />
              </div>
              <div className="oa-stat-info">
                <span className="oa-stat-number">{ofertas.length}</span>
                <span className="oa-stat-label">Ofertas Disponibles</span>
              </div>
            </div>
            <div className="oa-stat-card">
              <div className="oa-stat-icon">
                <Star size={24} />
              </div>
              <div className="oa-stat-info">
                <span className="oa-stat-number">
                  {ofertas.filter((o) => o.matched).length}
                </span>
                <span className="oa-stat-label">Ofertas Recomendadas</span>
              </div>
            </div>
            <div className="oa-stat-card">
              <div className="oa-stat-icon">
                <Send size={24} />
              </div>
              <div className="oa-stat-info">
                <span className="oa-stat-number">{appliedOffers.length}</span>
                <span className="oa-stat-label">Postulaciones</span>
              </div>
            </div>
          </div>

          {/* Lista de ofertas */}
          <div className="oa-offers-section">
            <div className="oa-offers-header">
              <h2>Ofertas Personalizadas</h2>
              <p>
                Basadas en tus habilidades:{" "}
                {profileData.habilidades?.join(", ")}
              </p>
            </div>

            <div className="oa-offers-grid">
              {currentOffers.map((oferta) => (
                <div
                  key={oferta.id}
                  className={`oa-offer-card ${
                    oferta.matched ? "oa-matched" : ""
                  }`}
                >
                  {oferta.matched && (
                    <div className="oa-match-badge">
                      <Star size={14} />
                      <span>{oferta.matchPercentage}% Match</span>
                    </div>
                  )}

                  <div className="oa-offer-title-section">
                    <h3 className="oa-offer-title">{oferta.titulo}</h3>
                    <p className="oa-company-name">{oferta.empresa}</p>
                  </div>

                  <div className="oa-offer-details">
                    <div className="oa-detail-item">
                      <MapPin size={16} />
                      <span>{oferta.ubicacion}</span>
                    </div>
                    <div className="oa-detail-item">
                      <Clock size={16} />
                      <span>{oferta.duracion}</span>
                    </div>
                    <div className="oa-detail-item">
                      <Building size={16} />
                      <span>{oferta.tipo}</span>
                    </div>
                  </div>

                  <p className="oa-offer-description">{oferta.descripcion}</p>

                  <div className="oa-offer-requirements">
                    <h4>Requisitos:</h4>
                    <div className="oa-requirements-tags">
                      {oferta.requisitos.map((req, index) => (
                        <span
                          key={index}
                          className={`oa-requirement-tag ${
                            profileData.habilidades?.includes(req)
                              ? "oa-matched"
                              : ""
                          }`}
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="oa-offer-actions">
                    <button
                      className="oa-secondary-button"
                      onClick={() => handleShowOfferDetails(oferta)}
                    >
                      <Eye size={16} />
                      Ver Detalles
                    </button>
                    <button
                      className={`oa-primary-button ${
                        appliedOffers.includes(oferta.id) ? "oa-applied" : ""
                      }`}
                      onClick={() => handleApplyToOffer(oferta.id)}
                      disabled={appliedOffers.includes(oferta.id)}
                    >
                      <Send size={16} />
                      {appliedOffers.includes(oferta.id)
                        ? "Postulado"
                        : "Postularse"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="oa-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`oa-page-button ${
                        currentPage === page ? "oa-active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Menú de perfil flotante */}
        {showProfileMenu && (
          <div className="oa-fixed-profile-menu" ref={profileMenuRef}>
            <button
              className="oa-profile-menu-item"
              onClick={handleNavigateToProfile}
            >
              <User size={16} />
              <span>Ver perfil</span>
            </button>
            <button
              className="oa-profile-menu-item"
              onClick={() => {
                createExplosionEffect(
                  mousePosition.x,
                  mousePosition.y,
                  "#10b981"
                );
                setShowProfileMenu(false);
                setShowProfileModal(true);
              }}
            >
              <Edit size={16} />
              <span>Editar perfil</span>
            </button>
            <button
              className="oa-profile-menu-item oa-logout"
              onClick={() => {
                createExplosionEffect(
                  mousePosition.x,
                  mousePosition.y,
                  "#f43f5e"
                );
                setTimeout(() => navigate("/"), 300);
              }}
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}

        {/* Modal de detalles de oferta */}
        {showOfferModal && selectedOffer && (
          <div className="oa-modal-overlay">
            <div className="oa-modal-container oa-offer-modal" ref={modalRef}>
              <div className="oa-modal-header">
                <h2 className="oa-modal-title">{selectedOffer.titulo}</h2>
                <button
                  className="oa-close-button"
                  onClick={() => setShowOfferModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="oa-modal-content">
                <div>
                  <h3>{selectedOffer.empresa}</h3>
                  <p>{selectedOffer.ubicacion}</p>
                </div>

                <div className="oa-modal-section">
                  <h4>Descripción</h4>
                  <p>{selectedOffer.descripcion}</p>
                </div>

                <div className="oa-modal-section">
                  <h4>Requisitos</h4>
                  <div className="oa-requirements-tags">
                    {selectedOffer.requisitos.map((req, index) => (
                      <span
                        key={index}
                        className={`oa-requirement-tag ${
                          profileData.habilidades?.includes(req)
                            ? "oa-matched"
                            : ""
                        }`}
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="oa-modal-section">
                  <h4>Información Adicional</h4>
                  <div className="oa-modal-details-grid">
                    <div className="oa-modal-detail">
                      <Calendar size={16} />
                      <span>Duración: {selectedOffer.duracion}</span>
                    </div>
                    <div className="oa-modal-detail">
                      <Clock size={16} />
                      <span>
                        Fecha límite:{" "}
                        {new Date(
                          selectedOffer.fechaLimite
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="oa-modal-footer">
                <button
                  className={`oa-primary-button ${
                    appliedOffers.includes(selectedOffer.id) ? "oa-applied" : ""
                  }`}
                  onClick={() => {
                    handleApplyToOffer(selectedOffer.id);
                    setShowOfferModal(false);
                  }}
                  disabled={appliedOffers.includes(selectedOffer.id)}
                >
                  <Send size={16} />
                  {appliedOffers.includes(selectedOffer.id)
                    ? "Ya Postulado"
                    : "Postularse Ahora"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición de perfil */}
        {showProfileModal && (
          <div className="oa-modal-overlay">
            <div className="oa-modal-container oa-profile-modal" ref={modalRef}>
              <div className="oa-modal-header">
                <h2 className="oa-modal-title">Editar Perfil</h2>
                <button
                  className="oa-close-button"
                  onClick={() => setShowProfileModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="oa-modal-content">
                <div className="oa-profile-form">
                  <div className="oa-profile-form-grid">
                    <div className="oa-form-group">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        value={profileData.nombre}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            nombre: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="apellido">Apellido</label>
                      <input
                        type="text"
                        id="apellido"
                        value={profileData.apellido}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            apellido: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="escuela">Escuela/Instituto</label>
                      <input
                        type="text"
                        id="escuela"
                        value={profileData.escuela}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            escuela: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="edad">Edad</label>
                      <input
                        type="number"
                        id="edad"
                        value={profileData.edad}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            edad: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="ubicacion">Ubicación</label>
                      <input
                        type="text"
                        id="ubicacion"
                        value={profileData.ubicacion}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            ubicacion: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="oa-form-group oa-full-width">
                      <label htmlFor="competencias">Competencias</label>
                      <input
                        type="text"
                        id="competencias"
                        value={profileData.competencias}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            competencias: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="oa-form-group">
                      <label htmlFor="nivelTecnico">Nivel técnico</label>
                      <select
                        id="nivelTecnico"
                        value={profileData.nivelTecnico}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            nivelTecnico: e.target.value,
                          })
                        }
                      >
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="oa-modal-footer">
                <button
                  className="oa-cancel-button"
                  onClick={() => setShowProfileModal(false)}
                >
                  Cancelar
                </button>
                <button className="oa-save-button" onClick={saveProfileData}>
                  <Edit size={18} />
                  <span>Guardar cambios</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pie de página */}
        <footer className={`oa-page-footer ${loaded ? "oa-loaded" : ""}`}>
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </div>
    </div>
  );
};

export default OfertasAlumnos;