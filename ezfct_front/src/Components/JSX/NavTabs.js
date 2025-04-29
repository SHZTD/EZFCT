import { NavLink } from 'react-router-dom';
import paperIcon from '../../Imagenes/paper.png';
import usersIcon from '../../Imagenes/users.png';
import questionIcon from '../../Imagenes/question.png';
import '../CSS/NavTabs.css'; // crea o importa un CSS común

const NavTabs = ({ activeTab }) => {
  return (
    <div className="nav-tabs">
      <NavLink to="/empresas/OfertasE" className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}>
        <img src={paperIcon} alt="Offers" className="tab-icon" />
        <span>Offers</span>
      </NavLink>
      <NavLink to="/empresas/Estudiantes" className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}>
        <img src={usersIcon} alt="Students" className="tab-icon" />
        <span>Students</span>
      </NavLink>
      <NavLink to="/empresas/Help" className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}>
        <img src={questionIcon} alt="Help" className="tab-icon" />
        <span>Help</span>
      </NavLink>
    </div>
  );
};

export default NavTabs;
