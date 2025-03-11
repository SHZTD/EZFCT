import "./EleccionUsuario.css"
import logo from '../Pages/Imagenes/logo.gif';


const EleccionUsuario = () => {
  return (
    <div className="menu-container">
      <div className="logo-section">
        <img src= {logo} alt="EasyFCT Logo" className="logo" />
        <h1>EasyFCT</h1>
      </div>

      <nav className="menu-options">
        <button className="menu-button">Compañia</button>
        <button className="menu-button">Profesores</button>
        <button className="menu-button">Alumnos</button>
        <button className="menu-button">Admin</button>
      </nav>
    </div>
  )
}

export default EleccionUsuario;

