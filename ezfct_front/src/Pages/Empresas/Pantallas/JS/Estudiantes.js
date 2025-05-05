import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavTabs from '../../../../Components/JSX/NavTabs.js';
import paperIcon from '../../../Imagenes/paper.png';
import usersIcon from '../../../Imagenes/users.png';
import questionIcon from '../../../Imagenes/question.png';
import logo from '../../../Imagenes/logo.gif';
import '../CSS/Estudiantes.css';

const Students = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [students, setStudents] = useState([
    { id: 1, name: 'Michal Jack', time: '28 mins ago', avatar: '/usuario1.jpg', selected: false },
    { id: 2, name: 'Sarah Johnson', time: '45 mins ago', avatar: '/usuario2.jpg', selected: false },
    { id: 3, name: 'Alex Rivera', time: '1 hour ago', avatar: '/usuario3.png', selected: true },
    { id: 4, name: 'Emma Wilson', time: '2 hours ago', avatar: '/usuario4.jpeg', selected: false },
    { id: 5, name: 'David Chen', time: '3 hours ago', avatar: '/usuario2.jpg', selected: false },
    { id: 6, name: 'Olivia Martinez', time: 'Yesterday', avatar: '/usuario3.png', selected: false },
    { id: 7, name: 'James Taylor', time: 'Yesterday', avatar: '/usuario1.jpg', selected: false },
    { id: 8, name: 'Sophia Lee', time: '2 days ago', avatar: '/usuario2.jpg', selected: false },
    { id: 9, name: 'Daniel Brown', time: '3 days ago', avatar: '/usuario3.png', selected: false },
    { id: 10, name: 'Isabella Garcia', time: 'Last week', avatar: '/usuario4.jpeg', selected: false },
    { id: 11, name: 'Ethan Wright', time: 'Last week', avatar: '/usuario2.jpg', selected: false },
    { id: 12, name: 'Mia Rodriguez', time: 'Last month', avatar: '/usuario3.png', selected: false }
  ]);

  // Efecto para la animación de entrada y partículas
  useEffect(() => {
    // Marcar como cargado para iniciar animaciones
    setTimeout(() => setLoaded(true), 100);
    
    // Crear partículas iniciales
    createInitialParticles();
    
    // Seguimiento del ratón
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Intervalo para animar partículas
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        }))
      );
    }, 50);
    
    // Ajustar partículas al cambiar el tamaño de la ventana
    const handleResize = () => {
      createInitialParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);
  
  // Función para crear partículas iniciales
  const createInitialParticles = () => {
    const newParticles = Array.from({ length: 50 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
      color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][Math.floor(Math.random() * 4)],
    }));
    
    setParticles(newParticles);
  };
  
  // Función para crear efecto de explosión de partículas
  const createExplosionEffect = (x, y, color) => {
    const explosionParticles = Array.from({ length: 30 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      size: Math.random() * 8 + 2,
      speedX: (Math.random() - 0.5) * 15,
      speedY: (Math.random() - 0.5) * 15,
      opacity: 1,
      color,
    }));
    
    setParticles(prev => [...prev, ...explosionParticles]);
    
    // Eliminar partículas de explosión después de un tiempo
    setTimeout(() => {
      setParticles(prev => prev.slice(0, 50));
    }, 1000);
  };

  // Función para manejar el cambio de pestaña
  const handleTabChange = (tabKey, route) => {
    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f59e0b");
    
    if (route) {
      setTimeout(() => {
        navigate(route);
      }, 300);
    } else {
      setActiveTab(tabKey);
    }
  };

  // Función para seleccionar un estudiante - MODIFICADA para navegar a la página de detalles
  const selectStudent = (id) => {
    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#6366f1");
    
    // Actualizar el estado para marcar el estudiante como seleccionado
    setStudents(students.map(student => ({
      ...student,
      selected: student.id === id
    })));
    
    // Navegar a la página de detalles del estudiante después de un breve retraso
    setTimeout(() => {
      navigate(`/empresas/InfoEstudiantes/${id}`);
    }, 300);
  };

  // Configuración de las pestañas
  const tabs = [
    { key: 'offers', label: 'Offers', icon: paperIcon, route: '/empresa/inicio' },
    { key: 'students', label: 'Students', icon: usersIcon, route: '/empresa/Estudiantes' },
    { key: 'help', label: 'Help', icon: questionIcon, route: '/empresas/HelpEmpresa' }
  ];

  return (
    <div className="students-page">
      {/* Partículas de fondo */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>
      
      {/* Efecto de luz que sigue al cursor */}
      <div 
        className="cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
      
      <div className="students-container">
        {/* Header con logo */}
        <div className={`students-header ${loaded ? 'loaded' : ''}`}>
          <div className="decorative-circle circle-1"></div>
          <div className="decorative-circle circle-2"></div>
          
          <div className={`logo-container ${loaded ? 'loaded' : ''}`}>
            <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
          </div>
          
          <h1 className={`title ${loaded ? 'loaded' : ''}`}>STUDENTS</h1>
          <div className={`divider ${loaded ? 'loaded' : ''}`}></div>
          <p className={`subtitle ${loaded ? 'loaded' : ''}`}>Find and connect with talented students</p>
        </div>

        {/* Navigation Tabs usando el componente NavTabs */}
        <NavTabs 
          activeTab={activeTab}
          loaded={loaded}
          tabs={tabs}
          onTabChange={handleTabChange}
        />

        {/* Students Grid */}
        <div className="students-grid-container">
          <div className={`students-grid ${loaded ? 'loaded' : ''}`}>
            {students.map((student) => (
              <div 
                key={student.id}
                className={`student-card ${student.selected ? 'selected' : ''} ${loaded ? 'loaded' : ''}`}
                onClick={() => selectStudent(student.id)}
                style={{ 
                  animationDelay: `${0.1 + (student.id * 0.05)}s`,
                  transitionDelay: `${0.1 + (student.id * 0.05)}s`
                }}
              >
                <div className="student-avatar">
                  <img src={student.avatar || "/placeholder.svg?height=40&width=40"} alt={`${student.name}'s avatar`} />
                </div>
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p>{student.time}</p>
                </div>
                <div className="selection-indicator"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="footer">
          <p className={loaded ? 'loaded' : ''}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  );
};

export default Students;