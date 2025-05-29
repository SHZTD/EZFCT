import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"

/* Imports generales*/
import EleccionUsuario from "./Pages/EleccionUsuario"

/* Imports Empresa*/
import InicioEmpresa from "./Pages/Empresas/Inicio/JS/Inicio"
import LoginEmpresa from "./Pages/Empresas/Inicio/JS/Login"
import RegisterEmpresa from "./Pages/Empresas/Inicio/JS/Register"
import CreacionOfertas from "./Pages/Empresas/Pantallas/JS/CreacionOfertas.js"
import OfertasPublicadas from "./Pages/Empresas/Pantallas/JS/OfertasPublicadas.js"
import EstudiantesEmpresa from "./Pages/Empresas/Pantallas/JS/Estudiantes.js"
import InfoEstudianteEmpresa from "./Pages/Empresas/Pantallas/JS/InfoEstudiante.js"

/* Imports profesor*/

import InicioProfesor from "./Pages/Profesores/Inicio/JS/Inicio.js"
import LoginProfesor from "./Pages/Profesores/Inicio/JS/Login.js"
import RegisterProfesor from "./Pages/Profesores/Inicio/JS/Register.js"
import OfertasProfesor from "./Pages/Profesores/Pantallas/JS/OfertasProfesor.js"
import DetallesOferta from "./Pages/Profesores/Pantallas/JS/DetallesOferta.js"
import AlumnosProfesor from "./Pages/Profesores/Pantallas/JS/AlumnosProfesor.js"
import DatosAlumnosProfesor from "./Pages/Profesores/Pantallas/JS/DatosAlumno.js"
import AreaContactoProfesor from "./Pages/Profesores/Pantallas/JS/AreaContacto.js"
import CrearAlumno from "./Pages/Profesores/Pantallas/JS/CrearAlumno.js"

/* Imports alumnos*/

import LoginAlumno from "./Pages/Alumno/Inicio/JS/Login.js"
import DiarioAlumno from "./Pages/Alumno/Pantallas/JS/Diario.js"
import DatosAlumno from "./Pages/Alumno/Pantallas/JS/DatosAlumno.js"
import OfertasAlumnos from "./Pages/Alumno/Pantallas/JS/OfertasAlumnos.js"

/* Imports Admin*/
import LoginAdmin from "./Pages/Admin/Inicio/JS/LoginAdmin"
import AdminDashboard from "./Pages/Admin/Pantallas/JS/Dashboard"
import AdminMessageDetail from "./Pages/Admin/Pantallas/JS/MessageDetail"
import GestionEmpresas from "./Pages/Admin/Pantallas/JS/GestionEmpresas"
import GestionProfesores from "./Pages/Admin/Pantallas/JS/GestionProfesores"
import GestionAlumnos from "./Pages/Admin/Pantallas/JS/GestionAlumnos"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Routes Empresa  */}

          <Route path="/" element={<EleccionUsuario />} />
          <Route path="/empresas/inicio" element={<InicioEmpresa />} />
          <Route path="/empresas/login" element={<LoginEmpresa />} />
          <Route path="/empresas/register" element={<RegisterEmpresa />} />
          <Route path="/empresas/OfertasE" element={<CreacionOfertas />} />
          <Route path="/empresas/OfertasP" element={<OfertasPublicadas />} />
          <Route path="/empresas/Estudiantes" element={<EstudiantesEmpresa />} />
          <Route path="/empresas/InfoEstudiantes/:id" element={<InfoEstudianteEmpresa />} />

          {/* Routes Profesor  */}
          <Route path="/profesores/inicio" element={<InicioProfesor />} />
          <Route path="/profesores/login" element={<LoginProfesor />} />
          <Route path="/profesores/register" element={<RegisterProfesor />} />
          <Route path="/profesores/Ofertas" element={<OfertasProfesor />} />
          <Route path="/profesores/detalles/:id" element={<DetallesOferta />} />
          <Route path="/profesores/alumnos" element={<AlumnosProfesor />} />
          <Route path="/profesores/datosAlumno" element={<DatosAlumnosProfesor />} />
          <Route path="/profesores/areaContacto" element={<AreaContactoProfesor />} />
          <Route path="/profesores/crearAlumno" element={<CrearAlumno />} />

          {/* Routes Alumnos  */}

          <Route path="/alumnos/login" element={<LoginAlumno />} />
          <Route path="/alumnos/diario" element={<DiarioAlumno />} />
          <Route path="/alumnos/ofertas" element={<OfertasAlumnos />} />
          <Route path="/alumnos/datosAlumno" element={<DatosAlumno />} />

          {/* Routes Admin */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/message/:id" element={<AdminMessageDetail />} />
          <Route path="/admin/empresas" element={<GestionEmpresas />} />
          <Route path="/admin/profesores" element={<GestionProfesores />} />
          <Route path="/admin/alumnos" element={<GestionAlumnos />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
