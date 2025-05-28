"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../CSS/Dashboard.css"

const API_URL = "http://192.168.1.139:7484/api/reporte"

const AdminDashboard = () => {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const navigate = useNavigate()

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/admin/login")
        return
      }

      const response = await fetch(`${API_URL}/admin`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()
      setMessages(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setLoading(false)
    }
  }

  const handleRespond = async (idReporte) => {
    if (!responseText.trim()) {
      alert("Please enter a response")
      return
    }

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${API_URL}/admin`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idReporte: idReporte,
          respuesta: responseText
        })
      })

      if (!response.ok) {
        throw new Error("Failed to submit response")
      }

      const updatedReport = await response.json()
      setMessages(messages.map(msg => 
        msg.idReporte === updatedReport.idReporte ? updatedReport : msg
      ))
      setResponseText("")
      setSelectedMessage(null)
    } catch (error) {
      console.error("Error responding to report:", error)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminEmail")
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
                <div key={message.idReporte} className="admin-message-card" onClick={() => setSelectedMessage(message)}>
                  <div className="admin-message-header">
                    <div className="admin-message-info">
                      <span className="admin-message-role">{message.rol}</span>
                      <span className="admin-message-email">{message.email}</span>
                    </div>
                    <span className={`admin-message-status ${message.respuesta ? "answered" : "pending"}`}>
                      {message.respuesta ? "Respondido" : "Pendiente"}
                    </span>
                  </div>
                  <div className="admin-message-preview">{message.mensaje}</div>
                  {message.respuesta && (
                    <div className="admin-message-response">
                      <strong>Respuesta:</strong> {message.respuesta}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="admin-no-messages">No hay mensajes para mostrar</div>
            )}
          </div>
        </div>

        {selectedMessage && !selectedMessage.respuesta && (
          <div className="admin-response-modal">
            <div className="admin-response-content">
              <h3>Responder a: {selectedMessage.email}</h3>
              <p>{selectedMessage.mensaje}</p>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
              />
              <div className="admin-response-buttons">
                <button onClick={() => handleRespond(selectedMessage.idReporte)}>Enviar Respuesta</button>
                <button onClick={() => {
                  setSelectedMessage(null)
                  setResponseText("")
                }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard