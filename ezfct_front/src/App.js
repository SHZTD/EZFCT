import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from "react";
import EleccionUsuario from './Pages/EleccionUsuario';
import InicioEmpresa from './Pages/Empresas/Inicio/JS/Inicio';
import InicioProfesor from './Pages/Profesores/Inicio/JS/Inicio';
import LoginEmpresa from './Pages/Empresas/Inicio/JS/Login';
import RegisterEmpresa from './Pages/Empresas/Inicio/JS/Register';
import CreacionOfertas from './Pages/Empresas/Pantallas/JS/CreacionOfertas.js';
import OfertasPublicadas from './Pages/Empresas/Pantallas/JS/OfertasPublicadas.js';
import EstudiantesEmpresa from './Pages/Empresas/Pantallas/JS/Estudiantes.js';
import InfoEstudianteEmpresa from './Pages/Empresas/Pantallas/JS/InfoEstudiante.js'
import HelpEmpresa from './Pages/Empresas/Pantallas/JS/HelpEmpresa.js'
function App() {
  return (
    <BrowserRouter> 
      <div className="App">
        <Routes>
          <Route path="/" element={<EleccionUsuario />} />
          <Route path="/empresas/inicio" element={<InicioEmpresa />} />
          <Route path="/profesores/inicio" element={<InicioProfesor />} />
          <Route path="/empresas/login" element={<LoginEmpresa />} />
          <Route path="/empresas/register" element={<RegisterEmpresa />} />
          <Route path="/empresas/OfertasE" element={<CreacionOfertas />} />
          <Route path="/empresas/OfertasP" element={<OfertasPublicadas />} />
          <Route path="/empresas/Estudiantes" element={<EstudiantesEmpresa />} />
          <Route path="/empresas/InfoEstudiantes/:id" element={<InfoEstudianteEmpresa />} />
          <Route path="/empresas/HelpEmpresa" element={<HelpEmpresa />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
