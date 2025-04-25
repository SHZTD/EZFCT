import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/CreacionOfertas.css';

// Importamos las imágenes
import paperIcon from '../../../Imagenes/paper.png';
import usersIcon from '../../../Imagenes/users.png';
import questionIcon from '../../../Imagenes/question.png';
import logo from '../../../Imagenes/logo.gif'; 

const CreacionOfertas = () => {
  const [activeTab, setActiveTab] = useState('offers');
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    direction: '',
    vacancies: '1'
  });
  
  const navigate = useNavigate();

  // Efecto para la animación de entrada y partículas
  useEffect(() => {
    // Marcar como cargado para iniciar animaciones
    setTimeout(() => setLoaded(true), 100);
    
    // Crear partículas iniciales
    createInitialParticles();
    
    // Seguimiento del ratón
    const handleMouseMove = e => {
      setMousePosition({ x: e.pageX, y: e.pageY });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const publishOffer = () => {
    // Validar que todos los campos estén completos
    if (!formData.title || !formData.description || !formData.skills || !formData.direction) {
      // Efecto de vibración si faltan campos
      document.querySelector('.form-card').classList.add('shake');
      setTimeout(() => {
        document.querySelector('.form-card').classList.remove('shake');
      }, 500);
      return;
    }
    
    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, "#10b981");
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/empresa/ofertase');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Publicando . . .</p>
        </div>
      </div>
    );
  }

  return (
    <div className="offers-page">
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
      
      <div className="offers-container">
        {/* Header con logo */}
        <div className={`offers-header ${loaded ? 'loaded' : ''}`}>
          <div className="decorative-circle circle-1"></div>
          <div className="decorative-circle circle-2"></div>
          
          <div className={`logo-container ${loaded ? 'loaded' : ''}`}>
            <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />
          </div>
          
          <h1 className={`title ${loaded ? 'loaded' : ''}`}>OFFERS</h1>
          <div className={`divider ${loaded ? 'loaded' : ''}`}></div>
          <p className={`subtitle ${loaded ? 'loaded' : ''}`}>Create and manage your job offers</p>
        </div>

        {/* Navigation Tabs */}
        <div className={`nav-tabs ${loaded ? 'loaded' : ''}`}>
          <button 
            className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <img src={paperIcon || "/placeholder.svg"} alt="Offers" className="tab-icon"/>
            <span>Offers</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => navigateTo('empresa/Estudiantes')}
          >
            <img src={usersIcon || "/placeholder.svg"} alt="Students" className="tab-icon"/>
            <span>Students</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => navigateTo('empresa/Help')}
          >
            <img src={questionIcon || "/placeholder.svg"} alt="Help" className="tab-icon"/>
            <span>Help</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="form-content">
          <div className={`form-card ${loaded ? 'loaded' : ''}`}>
            <h2 className="form-title">Create New Offer</h2>
            
            <div className={`form-group ${loaded ? 'loaded' : ''}`} style={{ transitionDelay: '0.3s' }}>
              <div className="input-container">
                <label htmlFor="title">Title of Offer</label>
                <div className="input-wrapper">
                  <span className="input-icon">📝</span>
                  <input 
                    type="text" 
                    id="title"
                    name="title"
                    className="custom-input"
                    placeholder="Enter the title of your offer"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className={`form-group ${loaded ? 'loaded' : ''}`} style={{ transitionDelay: '0.4s' }}>
              <div className="textarea-container">
                <label htmlFor="description">Description</label>
                <div className="input-wrapper">
                  <span className="input-icon textarea-icon">📄</span>
                  <textarea 
                    id="description"
                    name="description"
                    className="custom-textarea"
                    placeholder="Describe the offer in detail" 
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className={`form-group ${loaded ? 'loaded' : ''}`} style={{ transitionDelay: '0.5s' }}>
              <div className="input-container">
                <label htmlFor="skills">Skills Required</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔧</span>
                  <input 
                    type="text" 
                    id="skills"
                    name="skills"
                    className="custom-input"
                    placeholder="e.g. JavaScript, React, CSS"
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className={`form-group ${loaded ? 'loaded' : ''}`} style={{ transitionDelay: '0.6s' }}>
              <div className="input-container">
                <label htmlFor="direction">Direction</label>
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input 
                    type="text" 
                    id="direction"
                    name="direction"
                    className="custom-input"
                    placeholder="Enter the work location"
                    value={formData.direction}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className={`form-group ${loaded ? 'loaded' : ''}`} style={{ transitionDelay: '0.7s' }}>
              <div className="select-container">
                <label htmlFor="vacancies">Vacancies</label>
                <div className="input-wrapper">
                  <span className="input-icon">👥</span>
                  <select 
                    id="vacancies"
                    name="vacancies"
                    className="custom-select"
                    value={formData.vacancies}
                    onChange={handleInputChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3+</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`button-container ${loaded ? 'loaded' : ''}`} style={{ transitionDelay: '0.8s' }}>
              <button className="publish-button" onClick={publishOffer}>
                <span className="button-icon">✈️</span>
                Publish Offer
              </button>
            </div>
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

export default CreacionOfertas;