import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/OfertasPublicadas.css';

// Importamos las imágenes
import paperIcon from '../../../Imagenes/paper.png';
import usersIcon from '../../../Imagenes/users.png';
import questionIcon from '../../../Imagenes/question.png';
import { API_URL } from "../../../../constants"

const OfertasPublicadas = () => {
  const [activeTab, setActiveTab] = useState('offers');
  const [loaded, setLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const navigate = useNavigate();
  const particlesContainerRef = useRef(null);

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

  const navigateTo = (route) => {
    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#f59e0b");
    setTimeout(() => {
      navigate(`/${route}`);
    }, 300);
  };

  const handleBackToPublish = () => {
    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#3b82f6");
    setTimeout(() => {
      navigate('/empresas/OfertasE');
    }, 300);
  };

  return (
    <div className="offers-page">
      {/* Partículas de fondo */}
      <div className="particles-container" ref={particlesContainerRef}>
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
      
      <div className="offers-container">
        {/* Header */}
        <div className="offers-header">
          <div className="header-content">
            <h1 className={`header-title ${loaded ? 'loaded' : ''}`}>OFFERS</h1>
            <div className={`header-line ${loaded ? 'loaded' : ''}`}></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`nav-tabs ${loaded ? 'loaded' : ''}`}>
          <button 
            className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <img src={paperIcon || "/placeholder.svg"} alt="Offers" className="tab-icon"/>
            <span className="tab-text">Offers</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => navigateTo('empresas/Estudiantes')}
          >
            <img src={usersIcon || "/placeholder.svg"} alt="Students" className="tab-icon"/>
            <span className="tab-text">Students</span>
          </button>
         
        </div>

        {/* Success Content */}
        <div className="form-content">
          <div className={`success-card ${loaded ? 'loaded' : ''}`}>
            <div className="success-icon">✅</div>
            <h2 className="success-title">¡Oferta Publicada!</h2>
            <div className="success-message">
              <p>Tu oferta ha sido publicada correctamente y ya está disponible para los estudiantes.</p>
            </div>

            <div className={`button-container ${loaded ? 'loaded' : ''}`}>
              <button className="publish-again-button" onClick={handleBackToPublish}>
                <span className="button-icon">📝</span>
                <span>VOLVER A PUBLICAR</span>
                <div className="button-glow"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfertasPublicadas;