"use client"

import { useState, useEffect } from "react"
import logoImage from "../../../Imagenes/logo.gif"
import backArrow from "../../../Imagenes/back.png"
import { ButtonComp } from "../../../Others/ButtonComp"

const Inicio = () => {
  const [mounted, setMounted] = useState(false)
  const [activeButton, setActiveButton] = useState(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleButtonHover = (buttonName) => {
    setActiveButton(buttonName)
  }

  const handleButtonLeave = () => {
    setActiveButton(null)
  }

  return (
    <div className={`inicio-container ${mounted ? "fade-in" : ""}`}>
      <div className="inicio-card">
        <button className="back-button">
          <img src={backArrow || "/placeholder.svg"} alt="Back" className="back-arrow" />
        </button>

        <div className="logo-container">
          <div className="logo-wrapper">
            <img src={logoImage || "/placeholder.svg"} alt="EasyFCT Logo" className="logo" />
          </div>
          <h1 className="app-name">EasyFCT</h1>
        </div>

        <div className="buttons-container">
          <div
            className="button-wrapper"
            onMouseEnter={() => handleButtonHover("register")}
            onMouseLeave={handleButtonLeave}
          >
            <ButtonComp
              className={`register-button ${activeButton === "register" ? "active" : ""}`}
              text="Registrarse"
            />
          </div>

          <div
            className="button-wrapper"
            onMouseEnter={() => handleButtonHover("login")}
            onMouseLeave={handleButtonLeave}
          >
            <ButtonComp
              className={`login-button ${activeButton === "login" ? "active" : ""}`}
              text="Iniciar Sesión"
              route="/empresa/login"
            />
          </div>
        </div>

        <footer className="inicio-footer">
          <p>© {new Date().getFullYear()} EasyFCT</p>
        </footer>
      </div>
    </div>
  )
}

export default Inicio

