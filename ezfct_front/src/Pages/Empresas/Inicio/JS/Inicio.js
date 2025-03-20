import "../CSS/Inicio.css"
import logoImage from "../../../Imagenes/logo.gif" // Replace with your actual logo path
import backArrow from "../../../Imagenes/back.png" // Replace with your actual back arrow path
import { ButtonComp } from "../../../Others/ButtonComp"


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
        <ButtonComp className="register-button" text="Register" />
        <ButtonComp className="login-button" text="Login" route="/empresa/login"/>
      </div>
    </div>
  )
}

export default Inicio;

