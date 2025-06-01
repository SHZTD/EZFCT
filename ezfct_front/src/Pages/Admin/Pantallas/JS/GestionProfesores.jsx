import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/GestionProfesores.css"
import { API_URL } from "../../../../constants"

const GestionProfesores = () => {
  const [activeTab, setActiveTab] = useState("profesores")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false) 
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [profesores, setProfesores] = useState([])

  const [alumnos, setAlumnos] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@email.com",
      curso: "DAM",
      profesor: "Dr. Ana Martín",
      empresa: "TechCorp",
      estado: "En Prácticas",
      fechaInicio: "2024-03-01",
      progreso: 75,
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria@email.com",
      curso: "DAW",
      profesor: "Dr. Ana Martín",
      empresa: "DataSoft",
      estado: "En Prácticas",
      fechaInicio: "2024-02-15",
      progreso: 60,
    },
  ])

  const [reportes, setReportes] = useState([
    {
      id: 1,
      alumno: "Juan Pérez",
      profesor: "Dr. Ana Martín",
      empresa: "TechCorp",
      fecha: "2024-01-15",
      tipo: "Seguimiento",
      estado: "Revisado",
      observaciones: "Progreso satisfactorio",
    },
    {
      id: 2,
      alumno: "María García",
      profesor: "Dr. Ana Martín",
      empresa: "DataSoft",
      fecha: "2024-01-20",
      tipo: "Incidencia",
      estado: "Pendiente",
      observaciones: "Requiere atención",
    },
  ])

  const [formData, setFormData] = useState({})

useEffect(() => {
    const adminToken = localStorage.getItem("token")
    if (!adminToken) {
      navigate("/admin/login")
    }
    
    // Fetch teachers when component mounts
    fetchProfesores()
  }, [navigate])

  const fetchProfesores = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/usuarios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      const mappedProfesores = data
        .filter(user => user.rol === 'PROFESOR')
        .map(profesor => ({
          id: profesor.idUsuario,
          nombre: `${profesor.nombre} ${profesor.apellido}`,
          email: profesor.email,
          departamento: profesor.departamento || 'Sin departamento',
          telefono: '',
          especialidad: '',
          estado: 'Activo',
          fechaIngreso: new Date().toISOString().split('T')[0],
          alumnosAsignados: Math.floor(Math.random() * 10) + 1
        }));
      
      setProfesores(mappedProfesores);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching profesores:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfesores = profesores.filter(
    (profesor) =>
      profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.departamento.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAlumnos = alumnos.filter(
    (alumno) =>
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.curso.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredReportes = reportes.filter(
    (reporte) =>
      reporte.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.empresa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    setFormData(item || {})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === "profesor") {
      if (editingItem) {
        setProfesores(profesores.map((p) => (p.id === editingItem.id ? { ...formData, id: editingItem.id } : p)))
      } else {
        setProfesores([
          ...profesores,
          {
            ...formData,
            id: Date.now(),
            alumnosAsignados: 0,
            fechaIngreso: new Date().toISOString().split("T")[0],
          },
        ])
      }
    } else if (modalType === "alumno") {
      if (editingItem) {
        setAlumnos(alumnos.map((a) => (a.id === editingItem.id ? { ...formData, id: editingItem.id } : a)))
      } else {
        setAlumnos([
          ...alumnos,
          {
            ...formData,
            id: Date.now(),
            fechaInicio: new Date().toISOString().split("T")[0],
            progreso: 0,
          },
        ])
      }
    } else if (modalType === "reporte") {
      if (editingItem) {
        setReportes(reportes.map((r) => (r.id === editingItem.id ? { ...formData, id: editingItem.id } : r)))
      } else {
        setReportes([
          ...reportes,
          {
            ...formData,
            id: Date.now(),
            fecha: new Date().toISOString().split("T")[0],
          },
        ])
      }
    }

    closeModal()
  }

  const handleDelete = async (type, id) => {
    console.log("Deleting:", type, "ID:", id); // Debug log
    
    if (window.confirm("¿Estás seguro de eliminar este profesor?")) {
      try {
        console.log("Making request to:", `${API_URL}/api/usuarios/${id}`); // Debug log
        
        const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (!response.ok) throw new Error("Error en la petición");
        
        setProfesores(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error al eliminar");
      }
    }
  };
  
  const renderProfesores = () => (
    <div className="gestion-profesores-content">
      <div className="gestion-profesores-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar profesores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          className="refresh-btn" 
          onClick={fetchProfesores} 
          disabled={isLoading}
        >
          🔄 {isLoading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {isLoading ? (
        <div className="loading-message">Cargando profesores...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <div className="table-container">
        <table className="data-table">
              <thead>
                <tr>
                  <th>Profesor</th>
                  <th>Contacto</th>
                  <th>Departamento</th>
                  <th>Alumnos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfesores.map((profesor) => (
                  <tr key={profesor.idUsuario}>
                    <td>
                      <div className="profesor-info">
                        <strong>{profesor.nombre}</strong>
                        <small>Desde: {profesor.fechaIngreso}</small>
                      </div>
                    </td>
                    <td>
                      <div className="contacto-info">
                        <div>{profesor.email}</div>
                        <small>{profesor.telefono}</small>
                      </div>
                    </td>
                    <td>{profesor.departamento}</td>
                    <td>
                      <span className="alumnos-badge">{profesor.alumnosAsignados}</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          className="delete-btn" 
                          onClick={() => {
                            console.log("Profesor object:", profesor); // Debug log
                            handleDelete("profesor", profesor.idUsuario);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )

  const renderAlumnos = () => (
    <div className="gestion-alumnos-content">
      <div className="gestion-profesores-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar alumnos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="create-btn" onClick={() => openModal("alumno")}>
          ➕ Asignar Alumno
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Curso</th>
              <th>Profesor Asignado</th>
              <th>Empresa</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td>
                  <div className="alumno-info">
                    <strong>{alumno.nombre}</strong>
                    <small>{alumno.email}</small>
                  </div>
                </td>
                <td>{alumno.curso}</td>
                <td>{alumno.profesor}</td>
                <td>{alumno.empresa}</td>
                <td>
                  <div className="progreso-container">
                    <div className="progreso-bar">
                      <div className="progreso-fill" style={{ width: `${alumno.progreso}%` }}></div>
                    </div>
                    <span className="progreso-text">{alumno.progreso}%</span>
                  </div>
                </td>
                <td>
                  <span className={`status ${alumno.estado.toLowerCase().replace(" ", "-")}`}>{alumno.estado}</span>
                </td>
                <td>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => openModal("alumno", alumno)}>
                      ✏️
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete("alumno", alumno.id)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderReportes = () => (
    <div className="gestion-reportes-content">
      <div className="gestion-profesores-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar reportes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="create-btn" onClick={() => openModal("reporte")}>
          ➕ Nuevo Reporte
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Profesor</th>
              <th>Empresa</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReportes.map((reporte) => (
              <tr key={reporte.id}>
                <td>{reporte.alumno}</td>
                <td>{reporte.profesor}</td>
                <td>{reporte.empresa}</td>
                <td>{reporte.fecha}</td>
                <td>
                  <span className={`tipo ${reporte.tipo.toLowerCase()}`}>{reporte.tipo}</span>
                </td>
                <td>
                  <span className={`status ${reporte.estado.toLowerCase()}`}>{reporte.estado}</span>
                </td>
                <td>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => openModal("reporte", reporte)}>
                      ✏️
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete("reporte", reporte.id)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderModal = () => {
    if (!showModal) return null

    const getFormFields = () => {
      if (modalType === "profesor") {
        return (
          <>
            <input
              type="text"
              placeholder="Nombre completo"
              value={formData.nombre || ""}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            <div className="form-row">
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.telefono || ""}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Departamento"
                value={formData.departamento || ""}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Especialidad"
                value={formData.especialidad || ""}
                onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                required
              />
            </div>
            <select
              value={formData.estado || "Activo"}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Licencia">En Licencia</option>
            </select>
          </>
        )
      } else if (modalType === "alumno") {
        return (
          <>
            <input
              type="text"
              placeholder="Nombre del alumno"
              value={formData.nombre || ""}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            <div className="form-row">
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <select
                value={formData.curso || ""}
                onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                required
              >
                <option value="">Seleccionar curso</option>
                <option value="DAM">DAM</option>
                <option value="DAW">DAW</option>
                <option value="ASIR">ASIR</option>
              </select>
            </div>
            <div className="form-row">
              <select
                value={formData.profesor || ""}
                onChange={(e) => setFormData({ ...formData, profesor: e.target.value })}
                required
              >
                <option value="">Asignar profesor</option>
                {profesores.map((prof) => (
                  <option key={prof.id} value={prof.nombre}>
                    {prof.nombre}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Empresa de prácticas"
                value={formData.empresa || ""}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              />
            </div>
            <div className="form-row">
              <select
                value={formData.estado || "En Prácticas"}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="En Prácticas">En Prácticas</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Suspendido">Suspendido</option>
              </select>
              <input
                type="number"
                placeholder="Progreso (%)"
                value={formData.progreso || ""}
                onChange={(e) => setFormData({ ...formData, progreso: e.target.value })}
                min="0"
                max="100"
              />
            </div>
          </>
        )
      } else if (modalType === "reporte") {
        return (
          <>
            <div className="form-row">
              <select
                value={formData.alumno || ""}
                onChange={(e) => setFormData({ ...formData, alumno: e.target.value })}
                required
              >
                <option value="">Seleccionar alumno</option>
                {alumnos.map((alumno) => (
                  <option key={alumno.id} value={alumno.nombre}>
                    {alumno.nombre}
                  </option>
                ))}
              </select>
              <select
                value={formData.profesor || ""}
                onChange={(e) => setFormData({ ...formData, profesor: e.target.value })}
                required
              >
                <option value="">Seleccionar profesor</option>
                {profesores.map((prof) => (
                  <option key={prof.id} value={prof.nombre}>
                    {prof.nombre}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Empresa"
              value={formData.empresa || ""}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              required
            />
            <div className="form-row">
              <select
                value={formData.tipo || ""}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              >
                <option value="">Tipo de reporte</option>
                <option value="Seguimiento">Seguimiento</option>
                <option value="Incidencia">Incidencia</option>
                <option value="Evaluación">Evaluación</option>
              </select>
              <select
                value={formData.estado || "Pendiente"}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Revisado">Revisado</option>
                <option value="Resuelto">Resuelto</option>
              </select>
            </div>
            <textarea
              placeholder="Observaciones"
              value={formData.observaciones || ""}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              rows="3"
            />
          </>
        )
      }
    }

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              {editingItem ? "Editar" : "Crear"} {modalType}
            </h3>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="modal-form">
            {getFormFields()}
            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="cancel-btn">
                Cancelar
              </button>
              <button type="submit" className="save-btn">
                {editingItem ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="gestion-profesores">
      <div className="page-header">
        <h1>Gestión de Profesores</h1>
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
          ← Volver al Panel
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "profesores" ? "active" : ""}`}
          onClick={() => setActiveTab("profesores")}
        >
          Profesores ({profesores.length})
        </button>
        <button className={`tab ${activeTab === "alumnos" ? "active" : ""}`} onClick={() => setActiveTab("alumnos")}>
          Alumnos ({alumnos.length})
        </button>
        <button className={`tab ${activeTab === "reportes" ? "active" : ""}`} onClick={() => setActiveTab("reportes")}>
          Reportes ({reportes.length})
        </button>
      </div>

      <div className="content">
        {activeTab === "profesores" && renderProfesores()}
        {activeTab === "alumnos" && renderAlumnos()}
        {activeTab === "reportes" && renderReportes()}
      </div>

      {renderModal()}
    </div>
  )
}

export default GestionProfesores
