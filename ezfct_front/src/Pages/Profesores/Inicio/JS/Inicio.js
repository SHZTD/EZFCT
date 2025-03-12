import "../CSS/Inicio.css"
import logoImage from "../../../Imagenes/logo.gif" // Replace with your actual logo path
import backArrow from "../../../Imagenes/back.png" // Replace with your actual back arrow path


const Inicio = () => {
  return (
    <div className="login-container">
      <div className="header">
        <button className="back-button">
          <img src={backArrow } alt="Back" className="back-arrow" />
        </button>
      </div>

      <div className="logo-container">
        <img src={logoImage} alt="EasyFCT Logo" className="logo" />
        <h1 className="app-name">EasyFCT</h1>
      </div>

      <div className="buttons-container">
        <button className="register-button">Register</button>
        <button className="login-button">Login</button>
      </div>
    </div>
  )
}

export default Inicio;

