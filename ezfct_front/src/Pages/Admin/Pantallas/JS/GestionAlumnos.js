"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/GestionAlumnos.css"

const GestionAlumnos = () => {
  const [activeTab, setActiveTab] = useState("alumnos")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  // Estados para datos
  const [alumnos, setAlumnos] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@email.com",
      telefono: "612345678",
      curso: "DAM",
      empresa: "TechCorp",
      profesor: "Dr. Ana Martín",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-06-01",
      estado: "En Prácticas",
      progreso: 75,
      calificacion: null,
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria@email.com",
      telefono: "687654321",
      curso: "DAW",
      empresa: "DataSoft",
      profesor: "Dr. Ana Martín",
      fechaInicio: "2024-02-15",
      fechaFin: "2024-05-15",
      estado: "Finalizado",
      progreso: 100,
      calificacion: 8.5,
    },
  ])

  const [diarios, setDiarios] = useState([
    {
      id: 1,
      alumno: "Juan Pérez",
      fecha: "2024-01-15",
      actividades: "Desarrollo de componentes React",
      horas: 8,
      observaciones: "Buen progreso en el desarrollo frontend",
      estado: "Aprobado",
    },
    {
      id: 2,
      alumno: "María García",
      fecha: "2024-01-16",
      actividades: "Configuración de base de datos",
      horas: 6,
      observaciones: "Excelente trabajo con SQL",
      estado: "Pendiente",
    },
  ])

  const [postulaciones, setPostulaciones] = useState([
    {
      id: 1,
      alumno: "Carlos López",
      oferta: "Desarrollador Backend",
      empresa: "TechCorp",
      fechaPostulacion: "2024-01-10",
      estado: "En Revisión",
      motivacion: "Interesado en desarrollo con Node.js",
    },
    {
      id: 2,
      alumno: "Ana Ruiz",
      oferta: "Diseñadora UX/UI",
      empresa: "DesignStudio",
      fechaPostulacion: "2024-01-12",
      estado: "Aceptada",
      motivacion: "Experiencia en Figma y Adobe XD",
    },
  ])

  const [formData, setFormData] = useState({})

  useEffect(() => {
    const adminToken = localStorage.getItem("token")
    if (!adminToken) {
      navigate("/admin/login")
    }
  }, [navigate])

  const filteredAlumnos = alumnos.filter(
    (alumno) =>
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.curso.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDiarios = diarios.filter(
    (diario) =>
      diario.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diario.actividades.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPostulaciones = postulaciones.filter(
    (postulacion) =>
      postulacion.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postulacion.oferta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postulacion.empresa.toLowerCase().includes(searchTerm.toLowerCase()),
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

    if (modalType === "alumno") {
      if (editingItem) {
        setAlumnos(alumnos.map((a) => (a.id === editingItem.id ? { ...formData, id: editingItem.id } : a)))
      } else {
        setAlumnos([
          ...alumnos,
          {
            ...formData,
            id: Date.now(),
            progreso: 0,
            calificacion: null,
          },
        ])
      }
    } else if (modalType === "diario") {
      if (editingItem) {
        setDiarios(diarios.map((d) => (d.id === editingItem.id ? { ...formData, id: editingItem.id } : d)))
      } else {
        setDiarios([
          ...diarios,
          {
            ...formData,
            id: Date.now(),
            fecha: new Date().toISOString().split("T")[0],
          },
        ])
      }
    } else if (modalType === "postulacion") {
      if (editingItem) {
        setPostulaciones(postulaciones.map((p) => (p.id === editingItem.id ? { ...formData, id: editingItem.id } : p)))
      } else {
        setPostulaciones([
          ...postulaciones,
          {
            ...formData,
            id: Date.now(),
            fechaPostulacion: new Date().toISOString().split("T")[0],
          },
        ])
      }
    }

    closeModal()
  }

  const handleDelete = (type, id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
      if (type === "alumno") {
        setAlumnos(alumnos.filter((a) => a.id !== id))
      } else if (type === "diario") {
        setDiarios(diarios.filter((d) => d.id !== id))
      } else if (type === "postulacion") {
        setPostulaciones(postulaciones.filter((p) => p.id !== id))
      }
    }
  }

  const renderAlumnos = () => (
    <div className="gestion-alumnos-content">
      <div className="gestion-alumnos-header">
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
          ➕ Nuevo Alumno
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Curso</th>
              <th>Empresa</th>
              <th>Profesor</th>
              <th>Período</th>
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
                <td>{alumno.empresa}</td>
                <td>{alumno.profesor}</td>
                <td>
                  <div className="periodo-info">
                    <small>{alumno.fechaInicio}</small>
                    <small>{alumno.fechaFin}</small>
                  </div>
                </td>
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
                  {alumno.calificacion && <div className="calificacion">Nota: {alumno.calificacion}</div>}
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

  const renderDiarios = () => (
    <div className="gestion-diarios-content">
      <div className="gestion-alumnos-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar entradas de diario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="create-btn" onClick={() => openModal("diario")}>
          ➕ Nueva Entrada
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Fecha</th>
              <th>Actividades</th>
              <th>Horas</th>
              <th>Observaciones</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiarios.map((diario) => (
              <tr key={diario.id}>
                <td>{diario.alumno}</td>
                <td>{diario.fecha}</td>
                <td>
                  <div className="actividades-info">{diario.actividades}</div>
                </td>
                <td>
                  <span className="horas-badge">{diario.horas}h</span>
                </td>
                <td>
                  <div className="observaciones-info">{diario.observaciones}</div>
                </td>
                <td>
                  <span className={`status ${diario.estado.toLowerCase()}`}>{diario.estado}</span>
                </td>
                <td>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => openModal("diario", diario)}>
                      ✏️
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete("diario", diario.id)}>
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

  const renderPostulaciones = () => (
    <div className="gestion-postulaciones-content">
      <div className="gestion-alumnos-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar postulaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="create-btn" onClick={() => openModal("postulacion")}>
          ➕ Nueva Postulación
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Oferta</th>
              <th>Empresa</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Motivación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPostulaciones.map((postulacion) => (
              <tr key={postulacion.id}>
                <td>{postulacion.alumno}</td>
                <td>{postulacion.oferta}</td>
                <td>{postulacion.empresa}</td>
                <td>{postulacion.fechaPostulacion}</td>
                <td>
                  <span className={`status ${postulacion.estado.toLowerCase().replace(" ", "-")}`}>
                    {postulacion.estado}
                  </span>
                </td>
                <td>
                  <div className="motivacion-info">{postulacion.motivacion}</div>
                </td>
                <td>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => openModal("postulacion", postulacion)}>
                      ✏️
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete("postulacion", postulacion.id)}>
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
      if (modalType === "alumno") {
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
              <input
                type="text"
                placeholder="Empresa de prácticas"
                value={formData.empresa || ""}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Profesor asignado"
              value={formData.profesor || ""}
              onChange={(e) => setFormData({ ...formData, profesor: e.target.value })}
            />
            <div className="form-row">
              <input
                type="date"
                placeholder="Fecha inicio"
                value={formData.fechaInicio || ""}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              />
              <input
                type="date"
                placeholder="Fecha fin"
                value={formData.fechaFin || ""}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
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
            {formData.estado === "Finalizado" && (
              <input
                type="number"
                placeholder="Calificación (0-10)"
                value={formData.calificacion || ""}
                onChange={(e) => setFormData({ ...formData, calificacion: e.target.value })}
                min="0"
                max="10"
                step="0.1"
              />
            )}
          </>
        )
      } else if (modalType === "diario") {
        return (
          <>
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
            <div className="form-row">
              <input
                type="date"
                value={formData.fecha || ""}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Horas trabajadas"
                value={formData.horas || ""}
                onChange={(e) => setFormData({ ...formData, horas: e.target.value })}
                min="1"
                max="12"
                required
              />
            </div>
            <textarea
              placeholder="Actividades realizadas"
              value={formData.actividades || ""}
              onChange={(e) => setFormData({ ...formData, actividades: e.target.value })}
              rows="3"
              required
            />
            <textarea
              placeholder="Observaciones"
              value={formData.observaciones || ""}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              rows="2"
            />
            <select
              value={formData.estado || "Pendiente"}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </>
        )
      } else if (modalType === "postulacion") {
        return (
          <>
            <input
              type="text"
              placeholder="Nombre del alumno"
              value={formData.alumno || ""}
              onChange={(e) => setFormData({ ...formData, alumno: e.target.value })}
              required
            />
            <div className="form-row">
              <input
                type="text"
                placeholder="Título de la oferta"
                value={formData.oferta || ""}
                onChange={(e) => setFormData({ ...formData, oferta: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Empresa"
                value={formData.empresa || ""}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                required
              />
            </div>
            <select
              value={formData.estado || "En Revisión"}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
              <option value="En Revisión">En Revisión</option>
              <option value="Aceptada">Aceptada</option>
              <option value="Rechazada">Rechazada</option>
              <option value="Pendiente">Pendiente</option>
            </select>
            <textarea
              placeholder="Carta de motivación"
              value={formData.motivacion || ""}
              onChange={(e) => setFormData({ ...formData, motivacion: e.target.value })}
              rows="4"
              required
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
    <div className="gestion-alumnos">
      <div className="page-header">
        <h1>Gestión de Alumnos</h1>
        <button className="back-btn" onClick={() => navigate("/admin/panel")}>
          ← Volver al Panel
        </button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === "alumnos" ? "active" : ""}`} onClick={() => setActiveTab("alumnos")}>
          Alumnos ({alumnos.length})
        </button>
        <button className={`tab ${activeTab === "diarios" ? "active" : ""}`} onClick={() => setActiveTab("diarios")}>
          Diarios ({diarios.length})
        </button>
        <button
          className={`tab ${activeTab === "postulaciones" ? "active" : ""}`}
          onClick={() => setActiveTab("postulaciones")}
        >
          Postulaciones ({postulaciones.length})
        </button>
      </div>

      <div className="content">
        {activeTab === "alumnos" && renderAlumnos()}
        {activeTab === "diarios" && renderDiarios()}
        {activeTab === "postulaciones" && renderPostulaciones()}
      </div>

      {renderModal()}
    </div>
  )
}

export default GestionAlumnos
