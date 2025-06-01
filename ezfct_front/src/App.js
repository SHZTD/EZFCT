import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"

/* Imports generales*/
import EleccionUsuario from "./Pages/EleccionUsuario"

/* Imports Empresa*/
import InicioEmpresa from "./Pages/Empresas/Inicio/JS/Inicio.jsx"
import LoginEmpresa from "./Pages/Empresas/Inicio/JS/Login.jsx"
import RegisterEmpresa from "./Pages/Empresas/Inicio/JS/Register.jsx"
import CreacionOfertas from "./Pages/Empresas/Pantallas/JS/CreacionOfertas.jsx"
import OfertasPublicadas from "./Pages/Empresas/Pantallas/JS/OfertasPublicadas.jsx"
import EstudiantesEmpresa from "./Pages/Empresas/Pantallas/JS/Estudiantes.jsx"
import InfoEstudianteEmpresa from "./Pages/Empresas/Pantallas/JS/InfoEstudiante.jsx"

/* Imports profesor*/

import InicioProfesor from "./Pages/Profesores/Inicio/JS/Inicio.jsx"
import LoginProfesor from "./Pages/Profesores/Inicio/JS/Login.jsx"
import RegisterProfesor from "./Pages/Profesores/Inicio/JS/Register.jsx"
import OfertasProfesor from "./Pages/Profesores/Pantallas/JS/OfertasProfesor.jsx"
import DetallesOferta from "./Pages/Profesores/Pantallas/JS/DetallesOferta.jsx"
import AlumnosProfesor from "./Pages/Profesores/Pantallas/JS/AlumnosProfesor.jsx"
import DatosAlumnosProfesor from "./Pages/Profesores/Pantallas/JS/DatosAlumno.jsx"
import AreaContactoProfesor from "./Pages/Profesores/Pantallas/JS/AreaContacto.jsx"
import CrearAlumno from "./Pages/Profesores/Pantallas/JS/CrearAlumno.jsx"

/* Imports alumnos*/

import LoginAlumno from "./Pages/Alumno/Inicio/JS/Login.jsx"
import DiarioAlumno from "./Pages/Alumno/Pantallas/JS/Diario.jsx"
import DatosAlumno from "./Pages/Alumno/Pantallas/JS/DatosAlumno.jsx"
import OfertasAlumnos from "./Pages/Alumno/Pantallas/JS/OfertasAlumnos.jsx"

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
          {/*<Route path="/profesores/datosAlumno" element={<DatosAlumnosProfesor />} />*/}
          <Route path="/profesores/datosAlumno/:id" element={<DatosAlumnosProfesor />} />
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
