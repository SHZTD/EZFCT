import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from "react";
import EleccionUsuario from './Pages/EleccionUsuario';
import InicioEmpresa from './Pages/Empresas/Inicio/JS/Inicio';
import InicioProfesor from './Pages/Profesores/Inicio/JS/Inicio';
import LoginEmpresa from './Pages/Empresas/Inicio/JS/Login'


function App() {
  return (
    <BrowserRouter> 
      <div className="App">
        <Routes>
          <Route path="/" element={<EleccionUsuario />} />
          <Route path ="/empresas/inicio" element={<InicioEmpresa />} />
          <Route path ="/profesores/inicio" element={<InicioProfesor />} />
          <Route path ="/empresa/login" element={<LoginEmpresa/>} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
