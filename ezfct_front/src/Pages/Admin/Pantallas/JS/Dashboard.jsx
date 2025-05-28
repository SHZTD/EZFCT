"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/Dashboard.css"
import { API_URL } from "../../../../constants.js"

const AdminDashboard = () => {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Verify authentication
    const adminToken = localStorage.getItem("token")
    if (!adminToken) {
      navigate("/admin/login")
      return
    }

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URL + "/api/reporte/admin", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      console.log("Full API response:", data); // Debug log
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      alert("Error al cargar los mensajes");
    } finally {
      setLoading(false);
    }
  }


    fetchMessages()
  }, [navigate])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/admin/login")
  }

  const filteredMessages = messages.filter((message) => {
    if (filter === "pending") return !message.respuesta
    if (filter === "answered") return message.respuesta
    return true
  })

  const stats = {
    total: messages.length,
    pending: messages.filter((m) => !m.respuesta).length,
    answered: messages.filter((m) => m.respuesta).length,
  }

  const handleMessageClick = (messageId) => {
    console.log("Navigating to message ID:", messageId);
    navigate(`/admin/message/${messageId}`);
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ color: "white", fontSize: "1.2rem" }}>Cargando panel de administración...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="admin-user-info">
          <span>Administrador: {localStorage.getItem("adminEmail")}</span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>{stats.total}</h3>
            <p>Total Mensajes</p>
          </div>
          <div className="admin-stat-card">
            <h3>{stats.pending}</h3>
            <p>Pendientes</p>
          </div>
          <div className="admin-stat-card">
            <h3>{stats.answered}</h3>
            <p>Respondidos</p>
          </div>
        </div>

        <div className="admin-management-section">
          <h2>Gestión del Sistema</h2>
          <div className="admin-management-cards">
            <div className="admin-management-card" onClick={() => navigate("/admin/empresas")}>
              <div className="management-icon">🏢</div>
              <h3>Gestión de Empresas</h3>
              <p>Administrar empresas y ofertas de prácticas</p>
            </div>
            <div className="admin-management-card" onClick={() => navigate("/admin/profesores")}>
              <div className="management-icon">👨‍🏫</div>
              <h3>Gestión de Profesores</h3>
              <p>Administrar profesores y asignaciones</p>
            </div>
            <div className="admin-management-card" onClick={() => navigate("/admin/alumnos")}>
              <div className="management-icon">👨‍🎓</div>
              <h3>Gestión de Alumnos</h3>
              <p>Administrar alumnos y seguimiento</p>
            </div>
          </div>
        </div>

        <div className="admin-messages-section">
          <div className="admin-messages-header">
            <h2>Mensajes de Ayuda</h2>
            <div className="admin-filter-buttons">
              <button
                className={`admin-filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                Todos
              </button>
              <button
                className={`admin-filter-btn ${filter === "pending" ? "active" : ""}`}
                onClick={() => setFilter("pending")}
              >
                Pendientes
              </button>
              <button
                className={`admin-filter-btn ${filter === "answered" ? "active" : ""}`}
                onClick={() => setFilter("answered")}
              >
                Respondidos
              </button>
            </div>
          </div>

          <div className="admin-messages-list">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
              <div 
                key={message.idReporte} 
                className="admin-message-card" 
                onClick={() => handleMessageClick(message.idReporte)}
              >
                  <div className="admin-message-header">
                    <div className="admin-message-info">
                      <span className="admin-message-role">{message.rol}</span>
                      <span className="admin-message-email">{message.email}</span>
                    </div>
                    <span className={`admin-message-status ${message.respuesta ? "answered" : "pending"}`}>
                      {message.respuesta ? "Respondido" : "Pendiente"}
                    </span>
                  </div>
                  <div className="admin-message-preview">
                    {message.mensaje.length > 100 
                      ? `${message.mensaje.substring(0, 100)}...` 
                      : message.mensaje}
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-no-messages">No hay mensajes para mostrar</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard