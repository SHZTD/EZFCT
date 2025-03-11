import "./EleccionUsuario.css"
import logo from '../Pages/Imagenes/logo.gif';
import {ButtonComp} from  "../Pages/Others/ButtonComp"


const EleccionUsuario = () => {
  return (
    <div className="menu-container">
      <div className="logo-section">
        <img src= {logo} alt="EasyFCT Logo" className="logo" />
        <h1>EasyFCT</h1>
      </div>

      <nav className="menu-options">
      <ButtonComp className="menu-button" text="Empresas" route="/empresas/inicio"/>
      <ButtonComp className="menu-button" text="Profesores" route="/profesores/inicio"/>
        <button className="menu-button">Alumnos</button>
        <button className="menu-button">Admin</button>
      </nav>
    </div>
  )
}

export default EleccionUsuario;

