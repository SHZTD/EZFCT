"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../../Imagenes/logo.gif"

const Inicio = () => {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [activeButton, setActiveButton] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [hoverBack, setHoverBack] = useState(false)

  useEffect(() => {
    setLoaded(true)

    const initialParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
      color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][Math.floor(Math.random() * 4)],
    }))

    setParticles(initialParticles)

    // Actualizar partículas
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        })),
      )
    }

    const interval = setInterval(animateParticles, 50)

   
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      clearInterval(interval)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleButtonHover = (index) => {
    setActiveButton(index)
  }

  const handleButtonClick = (action) => {
    const explosionParticles = Array.from({ length: 30 }, () => ({
      x: mousePosition.x,
      y: mousePosition.y,
      size: Math.random() * 8 + 2,
      speedX: (Math.random() - 0.5) * 15,
      speedY: (Math.random() - 0.5) * 15,
      opacity: 1,
      color: action === "login" ? "#3b82f6" : "#10b981",
    }))

    setParticles((prev) => [...prev, ...explosionParticles])

    // Aquí lógica para navegar a login
    console.log(`Acción: ${action}`)
  }

  // Función para volver atrás
  const handleBack = () => {
    // Efecto de explosión de partículas
    const explosionParticles = Array.from({ length: 20 }, () => ({
      x: mousePosition.x,
      y: mousePosition.y,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 10,
      speedY: (Math.random() - 0.5) * 10,
      opacity: 1,
      color: "#f43f5e",
    }))

    setParticles((prev) => [...prev, ...explosionParticles])

    // Navegar hacia atrás
    setTimeout(() => navigate(-1), 300)
  }

  // Datos de los botones
  const buttons = [
    { text: "Login", route: "/empresas/login", action: "login", color: "#2563eb", hoverColor: "#1d4ed8", icon: "🔑" },
    { text: "Register", route: "/empresas/register" ,action: "register", color: "#059669", hoverColor: "#047857", icon: "✨" },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        perspective: "1000px",
      }}
    >
      {/* Partículas de fondo */}
      {particles.map((particle, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            backgroundColor: particle.color,
            opacity: particle.opacity,
            pointerEvents: "none",
            transition: "opacity 0.5s ease",
            zIndex: 0,
          }}
        />
      ))}

      {/* Efecto de luz radial que sigue al cursor */}
      <div
        style={{
          position: "absolute",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Botón de volver atrás */}
      <button
        onClick={handleBack}
        onMouseEnter={() => setHoverBack(true)}
        onMouseLeave={() => setHoverBack(false)}
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          backgroundColor: hoverBack ? "rgba(244, 63, 94, 0.9)" : "rgba(244, 63, 94, 0.7)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          cursor: "pointer",
          boxShadow: hoverBack
            ? "0 10px 25px rgba(244, 63, 94, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.2), 0 0 20px rgba(244, 63, 94, 0.5)"
            : "0 8px 15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: loaded ? "scale(1)" : "scale(0)",
          opacity: loaded ? 1 : 0,
          zIndex: 10,
        }}
      >
        ←
      </button>

      {/* Contenedor principal con efecto de cristal */}
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          transform: loaded ? "rotateX(0deg) scale(1)" : "rotateX(20deg) scale(0.8)",
          opacity: loaded ? 1 : 0,
          transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease",
          zIndex: 2,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Logo central con animación */}
        <div
          style={{
            padding: "40px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Círculos decorativos animados */}
          <div
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)",
              top: "-50px",
              left: "-50px",
              animation: "float 8s infinite ease-in-out",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
              bottom: "-30px",
              right: "-30px",
              animation: "float 6s infinite ease-in-out reverse",
            }}
          />

          {/* Logo con animación de pulso */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "25px",
              borderRadius: "50%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), 0 0 0 15px rgba(255, 255, 255, 0.1)",
              marginBottom: "25px",
              animation: "pulse 2s infinite ease-in-out",
              transform: loaded ? "scale(1)" : "scale(0)",
              transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s",
            }}
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="EasyFCT Logo"
              style={{
                height: "90px",
                width: "90px",
                objectFit: "contain",
                filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
              }}
            />
          </div>

          {/* Título con animación de texto */}
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "white",
              letterSpacing: "1px",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
              marginBottom: "5px",
            }}
          >
            EasyFCT
          </h1>

          <div
            style={{
              width: "60px",
              height: "4px",
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "2px",
              margin: "5px 0 10px",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 0.8s ease 0.8s, opacity 0.8s ease 0.8s",
            }}
          />

          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "16px",
              textAlign: "center",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 1s, transform 0.8s ease 1s",
              marginBottom: "30px",
            }}
          >
            Bienvenido a tu plataforma educativa
          </p>

          {/* Línea decorativa con gradiente */}
          <div
            style={{
              width: "80%",
              height: "2px",
              background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)",
              margin: "0 auto 30px",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.8s ease 1.2s",
            }}
          />
        </div>

        {/* Contenido principal con botones */}
        <div
          style={{
            padding: "0 32px 40px",
            position: "relative",
          }}
        >
          {/* Botones con efectos avanzados */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {buttons.map((button, index) => (
              <button
                key={index}
                style={{
                  backgroundColor: activeButton === index ? button.hoverColor : button.color,
                  color: "white",
                  padding: "16px 24px",
                  borderRadius: "14px",
                  fontWeight: "600",
                  border: "none",
                  boxShadow:
                    activeButton === index
                      ? `0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.2), 0 0 20px ${button.color}`
                      : "0 8px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  transform: loaded ? "translateY(0) scale(1)" : "translateY(50px) scale(0.9)",
                  opacity: loaded ? 1 : 0,
                  transitionDelay: `${1.4 + index * 0.1}s`,
                  height: "60px",
                }}
                onClick={() => handleButtonClick(button.action)}
                onMouseEnter={() => handleButtonHover(index)}
                onMouseLeave={() => handleButtonHover(null)}
              >
                {/* Efecto de brillo en hover */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                    transform: activeButton === index ? "translateX(100%)" : "translateX(-100%)",
                    transition: "transform 0.8s ease",
                    pointerEvents: "none",
                  }}
                />

                {/* Icono del botón */}
                <span
                  style={{
                    fontSize: "20px",
                    marginRight: "10px",
                    transform: activeButton === index ? "scale(1.2)" : "scale(1)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {button.icon}
                </span>

                {button.text}
              </button>
            ))}
          </div>

          {/* Texto adicional con animación */}
          <div
            style={{
              textAlign: "center",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 1.6s, transform 0.8s ease 1.6s",
            }}
          >
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
              }}
            >
              Al continuar, aceptas nuestros{" "}
              <a href="#" style={{ color: "#3b82f6", textDecoration: "none" }}>
                Términos de servicio
              </a>{" "}
              y{" "}
              <a href="#" style={{ color: "#3b82f6", textDecoration: "none" }}>
                Política de privacidad
              </a>
            </p>
          </div>
        </div>

        {/* Pie de página con efecto de cristal */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            padding: "16px 24px",
            textAlign: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.7)",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.8s ease 1.8s",
            }}
          >
            © 2025 EasyFCT - Innovación Educativa
          </p>
        </div>
      </div>

      {/* Estilos globales para animaciones */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }
        
        * {
          box-sizing: border-box;
        }
      `,
        }}
      />
    </div>
  )
}

export default Inicio

