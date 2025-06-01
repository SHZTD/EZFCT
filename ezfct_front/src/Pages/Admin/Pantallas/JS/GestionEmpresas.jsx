import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/GestionEmpresas.css"
import { API_URL } from "../../../../constants"

const GestionEmpresas = () => {
  const [activeTab, setActiveTab] = useState("empresas")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const [empresas, setEmpresas] = useState([])

  const [practicas, setPracticas] = useState([
    {
      id: 1,
      titulo: "Desarrollador Frontend",
      empresa: "TechCorp",
      descripcion: "Desarrollo de interfaces web modernas",
      modalidad: "Presencial",
      vacantes: 3,
      fechaInicio: "2024-03-01",
      fechaFin: "2024-06-01",
      requisitos: "React, JavaScript, CSS",
      estado: "Activa",
    },
    {
      id: 2,
      titulo: "Analista de Datos",
      empresa: "DataSoft",
      descripcion: "Análisis y visualización de datos",
      modalidad: "Remoto",
      vacantes: 2,
      fechaInicio: "2024-04-01",
      fechaFin: "2024-07-01",
      requisitos: "Python, SQL, Power BI",
      estado: "Activa",
    },
  ])

  const [formData, setFormData] = useState({})

  useEffect(() => {
    const adminToken = localStorage.getItem("token")
    if (!adminToken) {
      navigate("/admin/login")
    }

      const fetchEmpresas = async () => {
      try {
        const response = await fetch(API_URL + "/api/empresa")
        if (!response.ok) throw new Error("Error fetching empresas.")
        const data = await response.json()
        setEmpresas(data)
      } catch (error) {
        console.error("Error fetching empresas:", error)
      }
    }

    fetchEmpresas()
  }, [])

  const filteredEmpresas = empresas.filter(
    (empresa) =>
      empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.nif.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPracticas = practicas.filter(
    (practica) =>
      practica.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practica.empresa.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  
  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === "empresa") {
      if (editingItem) {
        setEmpresas(empresas.map((e) => (e.id === editingItem.id ? { ...formData, id: editingItem.id } : e)))
      } else {
        setEmpresas([
          ...empresas,
          { ...formData, id: Date.now(), ofertas: 0, fechaRegistro: new Date().toISOString().split("T")[0] },
        ])
      }
    } else if (modalType === "practica") {
      if (editingItem) {
        setPracticas(practicas.map((p) => (p.id === editingItem.id ? { ...formData, id: editingItem.id } : p)))
      } else {
        setPracticas([...practicas, { ...formData, id: Date.now() }])
      }
    }

    closeModal()
  }

  const handleDelete = async (type, id) => {
    if (type !== "empresa") return; // Only handle empresa deletion
    
    if (window.confirm("¿Estás seguro de que quieres eliminar esta empresa?")) {
      try {
        const response = await fetch(API_URL + `/api/empresa/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response.ok) {
          // Remove the empresa from the local state if the API call succeeds
          setEmpresas(empresas.filter((empresa) => empresa.idEmpresa !== id));
          // You might want to show a success message here
          alert("Empresa eliminada correctamente");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar la empresa");
        }
      } catch (error) {
        console.error("Error deleting empresa:", error);
        alert(error.message || "Ocurrió un error al eliminar la empresa");
      }
    }
  };

  const renderEmpresas = () => (
    <div className="gestion-empresas-content">
      <div className="gestion-empresas-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar empresas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>NIF</th>
              <th>Contacto</th>
              <th>Ofertas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmpresas.map((empresa) => (
              <tr key={empresa.idEmpresa}>
                <td>
                  <div className="empresa-info">
                    <strong>{empresa.nombre}</strong>
                    <small>{empresa.direccion}</small>
                  </div>
                </td>
                <td>{empresa.nif}</td>
                <td>
                  <div className="contacto-info">
                    <div>{empresa.email}</div>
                    <small>{empresa.telefono}</small>
                  </div>
                </td>
                <td>
                  <span className="ofertas-badge">{empresa.ofertas}</span>
                </td>
                <td>
                  <div className="actions">
                    <button className="delete-btn" onClick={() => handleDelete("empresa", empresa.idEmpresa)}>
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

  const renderPracticas = () => (
    <div className="gestion-practicas-content">
      <div className="gestion-empresas-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar prácticas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Empresa</th>
              <th>Modalidad</th>
              <th>Vacantes</th>
              <th>Período</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPracticas.map((practica) => (
              <tr key={practica.id}>
                <td>
                  <div className="practica-info">
                    <strong>{practica.titulo}</strong>
                    <small>{practica.descripcion}</small>
                  </div>
                </td>
                <td>{practica.empresa}</td>
                <td>
                  <span className={`modalidad ${practica.modalidad.toLowerCase()}`}>{practica.modalidad}</span>
                </td>
                <td>
                  <span className="vacantes-badge">{practica.vacantes}</span>
                </td>
                <td>
                  <div className="periodo-info">
                    <small>{practica.fechaInicio}</small>
                    <small>{practica.fechaFin}</small>
                  </div>
                </td>
                <td>
                  <div className="actions">
                    <button className="delete-btn" onClick={() => handleDelete("practica", practica.id)}>
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
      if (modalType === "empresa") {
        return (
          <>
            <div className="form-row">
              <input
                type="text"
                placeholder="Nombre de la empresa"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="NIF"
                value={formData.nif || ""}
                onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email de contacto"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <div className="form-row">
              <input
                type="tel"
                placeholder="Teléfono"
                value={formData.telefono || ""}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Sector"
                value={formData.sector || ""}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Dirección"
              value={formData.direccion || ""}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              required
            />
            <select
              value={formData.estado || "Activa"}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
              <option value="Suspendida">Suspendida</option>
            </select>
          </>
        )
      } else if (modalType === "practica") {
        return (
          <>
            <input
              type="text"
              placeholder="Título de la práctica"
              value={formData.titulo || ""}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
            <select
              value={formData.empresa || ""}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              required
            >
              <option value="">Seleccionar empresa</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.nombre}>
                  {emp.nombre}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Descripción"
              value={formData.descripcion || ""}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows="3"
              required
            />
            <div className="form-row">
              <select
                value={formData.modalidad || ""}
                onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                required
              >
                <option value="">Modalidad</option>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
              </select>
              <input
                type="number"
                placeholder="Vacantes"
                value={formData.vacantes || ""}
                onChange={(e) => setFormData({ ...formData, vacantes: e.target.value })}
                min="1"
                required
              />
            </div>
            <div className="form-row">
              <input
                type="date"
                placeholder="Fecha inicio"
                value={formData.fechaInicio || ""}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                required
              />
              <input
                type="date"
                placeholder="Fecha fin"
                value={formData.fechaFin || ""}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                required
              />
            </div>
            <textarea
              placeholder="Requisitos"
              value={formData.requisitos || ""}
              onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
              rows="2"
            />
            <select
              value={formData.estado || "Activa"}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
              <option value="Activa">Activa</option>
              <option value="Cerrada">Cerrada</option>
              <option value="Pausada">Pausada</option>
            </select>
          </>
        )
      }
    }

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              {editingItem ? "Editar" : "Crear"} {modalType === "empresa" ? "Empresa" : "Práctica"}
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
    <div className="gestion-empresas">
      <div className="page-header">
        <h1>Gestión de Empresas</h1>
        <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
          ← Volver al Panel
        </button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === "empresas" ? "active" : ""}`} onClick={() => setActiveTab("empresas")}>
          Empresas ({empresas.length})
        </button>
        <button
          className={`tab ${activeTab === "practicas" ? "active" : ""}`}
          onClick={() => setActiveTab("practicas")}
        >
          Prácticas ({practicas.length})
        </button>
      </div>

      <div className="content">
        {activeTab === "empresas" && renderEmpresas()}
        {activeTab === "practicas" && renderPracticas()}
      </div>

      {renderModal()}
    </div>
  )
}

export default GestionEmpresas