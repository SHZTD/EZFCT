"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../CSS/MessageDetail.css"

const AdminMessageDetail = () => {
  const [message, setMessage] = useState(null)
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  // Datos simulados de mensajes
  const mockMessages = [
    {
      id: 1,
      email: "profesor1@universidad.com",
      rol: "PROFESOR",
      mensaje:
        "Tengo problemas para acceder a la sección de estudiantes. No puedo ver la lista completa de alumnos asignados. He intentado refrescar la página y cerrar sesión, pero el problema persiste. ¿Podrían ayudarme a solucionarlo?",
      respuesta: null,
      fecha: "2025-01-27",
    }
  ]

  useEffect(() => {
    // Verificar autenticación
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      navigate("/admin/login")
      return
    }

    // Simular carga del mensaje
    setTimeout(() => {
      const foundMessage = mockMessages.find((m) => m.id === Number.parseInt(id))
      if (foundMessage) {
        setMessage(foundMessage)
        setResponse(foundMessage.respuesta || "")
      } else {
        navigate("/admin/dashboard")
      }
      setLoading(false)
    }, 500)
  }, [id, navigate])

  const handleBack = () => {
    navigate("/admin/dashboard")
  }

  const handleSendResponse = async () => {
    if (!response.trim()) {
      alert("Por favor, escriba una respuesta")
      return
    }

    setSending(true)

    try {
      // Simular envío de respuesta
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Actualizar el mensaje localmente
      setMessage((prev) => ({
        ...prev,
        respuesta: response,
      }))

      alert("Respuesta enviada correctamente")
    } catch (error) {
      console.error("Error al enviar respuesta:", error)
      alert("Error al enviar la respuesta")
    } finally {
      setSending(false)
    }
  }

  const handleClearResponse = () => {
    setResponse("")
  }

  if (loading) {
    return (
      <div className="admin-message-detail">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ color: "white", fontSize: "1.2rem" }}>Cargando mensaje...</div>
        </div>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="admin-message-detail">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ color: "white", fontSize: "1.2rem" }}>Mensaje no encontrado</div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-message-detail">
      <header className="admin-message-header">
        <button className="admin-back-btn" onClick={handleBack}>
          <img src="/EZFCT-master/ezfct_front/src/Pages/Imagenes/back.png" alt="Volver" />
        </button>
        <h1 className="admin-message-title">Detalle del Mensaje</h1>
      </header>

      <div className="admin-message-content">
        <div className="admin-message-card">
          <div className="admin-message-meta">
            <div className="admin-message-info">
              <span className="admin-message-role">{message.rol}</span>
              <span className="admin-message-email">{message.email}</span>
            </div>
            <span className="admin-message-date">{message.fecha}</span>
          </div>

          <div className="admin-message-text">{message.mensaje}</div>
        </div>

        <div className="admin-response-section">
          <div className="admin-response-header">
            <h2 className="admin-response-title">Respuesta</h2>
            <span className={`admin-response-status ${message.respuesta ? "answered" : "pending"}`}>
              {message.respuesta ? "Respondido" : "Pendiente"}
            </span>
          </div>

          {message.respuesta ? (
            <div className="admin-existing-response">{message.respuesta}</div>
          ) : (
            <div className="admin-response-form">
              <textarea
                className="admin-response-textarea"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Escriba su respuesta aquí..."
                disabled={sending}
              />

              <div className="admin-response-actions">
                <button className="admin-response-btn secondary" onClick={handleClearResponse} disabled={sending}>
                  Limpiar
                </button>
                <button
                  className="admin-response-btn primary"
                  onClick={handleSendResponse}
                  disabled={sending || !response.trim()}
                >
                  {sending ? "Enviando..." : "Enviar Respuesta"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminMessageDetail
