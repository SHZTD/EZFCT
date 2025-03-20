"use client"

import { useState } from "react"
import "../CSS/Login.css"
import backIcon from "../../../Imagenes/back.png"
import eyeOpenIcon from "../../../Imagenes/eye_open.png"
import eyeClosedIcon from "../../../Imagenes/eye_close.png"
import facebookIcon from "../../../Imagenes/facebook.png"
import googleIcon from "../../../Imagenes/google.svg"
import appleIcon from "../../../Imagenes/apple.png"

const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (email === "user" && password === "pass") {
      alert("¡Inicio de sesión exitoso!");
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  }

  return (
    <div className="login-container">
      <div className="back-button" onClick={() => console.log("Navigate back")}>
        <img src={backIcon || "/back.png"} alt="Back" />
      </div>

      <h1 className="welcome-text">Welcome back!</h1>

      <div className="form-container">
        <div className="input-group">
          <input
            type="text" // Cambié de type="email" a type="text" para que funcione con "user"
            placeholder="Enter username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            <img
              src={showPassword ? eyeOpenIcon : eyeClosedIcon}
              alt={showPassword ? "Hide password" : "Show password"}
            />
          </div>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <div className="social-login-section">
          <p className="social-login-text">Or Login with</p>
          <div className="social-icons">
            <div className="social-icon" onClick={() => console.log("Login with Facebook")}>
              <img src={facebookIcon || "/facebook.png"} alt="Facebook" />
            </div>
            <div className="social-icon" onClick={() => console.log("Login with Google")}>
              <img src={googleIcon || "/google.svg"} alt="Google" />
            </div>
            <div className="social-icon" onClick={() => console.log("Login with Apple")}>
              <img src={appleIcon || "/apple.png"} alt="Apple" />
            </div>
          </div>
        </div>

        <div className="register-section">
          <p className="register-text">
            Don't have an account?
            <span className="register-link" onClick={() => console.log("Navigate to register page")}>
              {" "}
              Register Now
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
