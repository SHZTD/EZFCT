import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavTabs from '../../../../Components/JSX/NavTabs.js';
import paperIcon from '../../../Imagenes/paper.png';
import usersIcon from '../../../Imagenes/users.png';
import questionIcon from '../../../Imagenes/question.png';
import '../CSS/HelpEmpresa.css';

const Help = () => {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('help');
    const [activeIndex, setActiveIndex] = useState(0);
    const [floatingElements, setFloatingElements] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const contentRef = useRef(null);
  
    // Datos para las preguntas frecuentes
    const frequentQuestions = [
      'How to modify schedules?',
      'Can a student have two agreements?',
      'How to modify the daily activities?',
      'How to modify the company data?',
      'How do I assign a student to a company?',
      'How to change the student\'s personal data?',
      'How to create a tutor?',
      'How to access the company\'s data?'
    ];
  
    // Efecto para la animación de entrada y elementos flotantes
    useEffect(() => {
      // Marcar como cargado para iniciar animaciones
      setTimeout(() => setLoaded(true), 100);
      
      // Crear elementos flotantes iniciales (burbujas de conocimiento)
      createInitialFloatingElements();
      
      // Seguimiento del ratón
      const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      
      // Intervalo para animar elementos flotantes
      const interval = setInterval(() => {
        setFloatingElements(prevElements => 
          prevElements.map(element => ({
            ...element,
            x: element.x + element.speedX,
            y: element.y + element.speedY,
            // Si el elemento sale de la pantalla, lo reposicionamos
            ...(
              element.x < -50 || element.x > window.innerWidth + 50 || 
              element.y < -50 || element.y > window.innerHeight + 50
                ? {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    speedX: (Math.random() - 0.5) * 1,
                    speedY: (Math.random() - 0.5) * 1,
                  }
                : {}
            )
          }))
        );
      }, 50);
      
      // Ajustar elementos flotantes al cambiar el tamaño de la ventana
      const handleResize = () => {
        createInitialFloatingElements();
      };
      
      window.addEventListener('resize', handleResize);
      
      // Limpieza al desmontar
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        clearInterval(interval);
      };
    }, []);
    
    // Función para crear elementos flotantes iniciales
    const createInitialFloatingElements = () => {
      const newElements = Array.from({ length: 30 }, () => ({
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 40 + 20,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.3 + 0.1,
        // Usamos colores púrpura y violeta para la temática de ayuda
        color: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"][Math.floor(Math.random() * 4)],
        // Formas diferentes: círculos, cuadrados, triángulos
        shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)],
        // Rotación para formas no circulares
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      }));
      
      setFloatingElements(newElements);
    };
    
    // Función para crear efecto de explosión de elementos
    const createExplosionEffect = (x, y, color) => {
      const explosionElements = Array.from({ length: 15 }, () => ({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        size: Math.random() * 30 + 10,
        speedX: (Math.random() - 0.5) * 8,
        speedY: (Math.random() - 0.5) * 8,
        opacity: 0.7,
        color,
        shape: "circle", // Las explosiones son siempre círculos
        rotation: 0,
        rotationSpeed: 0,
      }));
      
      setFloatingElements(prev => [...prev, ...explosionElements]);
      
      // Eliminar elementos de explosión después de un tiempo
      setTimeout(() => {
        setFloatingElements(prev => prev.slice(0, 30));
      }, 1500);
    };
  
    // Función para manejar el cambio de pestaña
    const handleTabChange = (tabKey, route) => {
      // Efecto de explosión de elementos
      createExplosionEffect(mousePosition.x, mousePosition.y, "#8b5cf6");
      
      if (route) {
        setTimeout(() => {
          navigate(route);
        }, 300);
      } else {
        setActiveTab(tabKey);
      }
    };
  
    // Función para cambiar entre secciones
    const goToSection = (index) => {
      setActiveIndex(index);
      
      // Efecto de explosión al cambiar de sección
      createExplosionEffect(
        window.innerWidth / 2, 
        window.innerHeight - 50, 
        ["#8b5cf6", "#a78bfa", "#c4b5fd"][index]
      );
      
      // Scroll suave al inicio del contenido
      if (contentRef.current) {
        contentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };
  
    // Configuración de las pestañas
    const tabs = [
      { key: 'offers', label: 'Offers', icon: paperIcon, route: '/empresa/inicio' },
      { key: 'students', label: 'Students', icon: usersIcon, route: '/empresa/Estudiantes' },
      { key: 'help', label: 'Help', icon: questionIcon, route: '/empresa/Help' }
    ];
  
    return (
      <div className="help-page">
        {/* Elementos flotantes de fondo */}
        <div className="floating-elements-container">
          {floatingElements.map(element => (
            <div
              key={element.id}
              className={`floating-element ${element.shape}`}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.size}px`,
                height: `${element.size}px`,
                backgroundColor: element.color,
                opacity: element.opacity,
                transform: `rotate(${element.rotation + (element.rotationSpeed * 5)}deg)`,
              }}
            />
          ))}
        </div>
        
        {/* Efecto de luz que sigue al cursor */}
        <div 
          className="cursor-glow"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        />
        
        <div className={`help-container ${loaded ? 'loaded' : ''}`}>
          {/* Header con fondo animado */}
          <div className={`help-header ${loaded ? 'loaded' : ''}`}>
            <div className="gif-background">
              <h1 className="title">HELP</h1>
              <div className="knowledge-icons">
                <span className="knowledge-icon">💡</span>
                <span className="knowledge-icon">📚</span>
                <span className="knowledge-icon">🔍</span>
                <span className="knowledge-icon">❓</span>
              </div>
            </div>
          </div>
  
          {/* Navigation Tabs usando el componente NavTabs */}
          <NavTabs 
            activeTab={activeTab}
            loaded={loaded}
            tabs={tabs}
            onTabChange={handleTabChange}
          />
  
          {/* Contenido principal con sistema de pestañas */}
          <div className="help-content" ref={contentRef}>
            {/* Selector de secciones */}
            <div className="section-tabs">
              <button 
                className={`section-tab ${activeIndex === 0 ? 'active' : ''}`}
                onClick={() => goToSection(0)}
              >
                <span className="section-icon">❓</span>
                <span className="section-label">Frequent Questions</span>
              </button>
              <button 
                className={`section-tab ${activeIndex === 1 ? 'active' : ''}`}
                onClick={() => goToSection(1)}
              >
                <span className="section-icon">🕒</span>
                <span className="section-label">Opening Hours</span>
              </button>
              <button 
                className={`section-tab ${activeIndex === 2 ? 'active' : ''}`}
                onClick={() => goToSection(2)}
              >
                <span className="section-icon">💬</span>
                <span className="section-label">Chat with an Agent</span>
              </button>
            </div>
  
            {/* Contenido de las secciones */}
            <div className={`section-content ${loaded ? 'loaded' : ''}`}>
              {/* Sección 1: Preguntas frecuentes */}
              {activeIndex === 0 && (
                <div className="slide-content">
                  <h2 className="section-title">
                    <span className="section-icon">❓</span>
                    Frequent questions
                  </h2>
                  <div className="questions-list">
                    {frequentQuestions.map((question, index) => (
                      <div 
                        key={index} 
                        className="question-item"
                        style={{ 
                          animationDelay: `${0.1 + (index * 0.05)}s`,
                          transitionDelay: `${0.1 + (index * 0.05)}s`
                        }}
                      >
                        <div className="question-number">{index + 1}</div>
                        <div className="question-text">{question}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              {/* Sección 2: Horarios de atención */}
              {activeIndex === 1 && (
                <div className="slide-content">
                  <h2 className="section-title">
                    <span className="section-icon">🕒</span>
                    Opening hours
                  </h2>
                  <div className="hours-list">
                    {[
                      { time: '9:00 AM - 13:00 PM', service: 'Tickets' },
                      { time: '10:00 AM - 11:00 AM', service: 'Update schedule' },
                      { time: '8:00 AM - 14:00 PM', service: 'Practices' },
                      { time: '19:00 AM - 20:30 PM', service: 'Schedule call professor' },
                      { time: '8:00 AM - 14:00 PM', service: 'Schedule call company' },
                      { time: '16:00 PM - 19:00 PM', service: 'Chat with an agent' },
                      { time: 'Never', service: 'Cheater' }
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className="hour-item"
                        style={{ 
                          animationDelay: `${0.1 + (index * 0.05)}s`,
                          transitionDelay: `${0.1 + (index * 0.05)}s`
                        }}
                      >
                        <div className="hour-time">{item.time}</div>
                        <div className="hour-service">{item.service}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              {/* Sección 3: Chat con un agente */}
              {activeIndex === 2 && (
                <div className="slide-content">
                  <h2 className="section-title">
                    <span className="section-icon">💬</span>
                    Chat with an agent
                  </h2>
                  <div className="chat-container">
                    {[
                      { 
                        avatar: 'https://i.pravatar.cc/40?img=26', 
                        name: 'Tiana Saris', 
                        time: '28 mins ago',
                        message: 'Hi, Allison hope you\'re doing well, I would like to consult you about your previous visit.'
                      },
                      { 
                        avatar: 'https://i.pravatar.cc/40?img=44', 
                        name: 'Allison Seris', 
                        time: '25 mins ago',
                        message: 'Hi, Tiana I have a big! problem, I don\'t how create a variant. Can u help me.'
                      },
                      { 
                        avatar: 'https://i.pravatar.cc/40?img=26', 
                        name: 'Tiana Saris', 
                        time: '18 mins ago',
                        message: 'Hi, in variant section you have an option to create the component and when you have the option to give new variant'
                      },
                      { 
                        avatar: 'https://i.pravatar.cc/40?img=44', 
                        name: 'Allison Seris', 
                        time: '17 mins ago',
                        message: 'A lo true, thank you very much. Now I can continue with my project'
                      }
                    ].map((chat, index) => (
                      <div 
                        key={index} 
                        className="chat-message"
                        style={{ 
                          animationDelay: `${0.1 + (index * 0.1)}s`,
                          transitionDelay: `${0.1 + (index * 0.1)}s`
                        }}
                      >
                        <div className="avatar">
                          <img src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                        </div>
                        <div className="message-content">
                          <div className="message-header">
                            <span className="sender-name">{chat.name}</span>
                            <span className="message-time">{chat.time}</span>
                          </div>
                          <p>{chat.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
  
  export default Help;