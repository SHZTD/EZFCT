import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Pages/Imagenes/logo.gif';
import ButtonComp from '../Components/JSX/ButtonComp.js';
import './EleccionUsuario.css';

const EleccionUsuario = () => {
  // limpia el local storage
  localStorage.clear()
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setLoaded(true);

    const generateParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 4)],
    }));
    setParticles(generateParticles);

    const animate = () => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: (p.x + p.speedX + window.innerWidth) % window.innerWidth,
          y: (p.y + p.speedY + window.innerHeight) % window.innerHeight,
        }))
      );
    };

    const interval = setInterval(animate, 50);
    const onMouseMove = e => setMousePosition({ x: e.clientX, y: e.clientY });

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const handleButtonClick = route => {
    const explosion = Array.from({ length: 30 }, () => ({
      x: mousePosition.x,
      y: mousePosition.y,
      size: Math.random() * 8 + 2,
      speedX: (Math.random() - 0.5) * 15,
      speedY: (Math.random() - 0.5) * 15,
      opacity: 1,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 4)],
    }));

    setParticles(prev => [...prev, ...explosion]);
    setTimeout(() => navigate(route), 300);
  };

  const buttons = [
   { text: "Empresas", route: "/empresas/inicio", icon: "🏢", className: "btn--empresas" },
    { text: "Profesores", route: "/profesores/inicio", icon: "👨‍🏫", className: "btn--profesores" },
    { text: "Alumnos", route: "/alumnos/login", icon: "👨‍🎓", className: "btn--alumnos" },
    { text: "Admin", route: "/admin/login", icon: "⚙️", className: "btn--admin" },
  ];

  return (
    <div className="eu-container">
      {/* Partículas animadas */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="eu-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
          }}
        />
      ))}



      {/* Panel principal con animación */}
      <main className={`eu-main${loaded ? ' loaded' : ''}`} role="main">
        <header className="eu-header">
          <div className="eu-circle eu-circle1" />
          <div className="eu-circle eu-circle2" />
          <div className="eu-logo" style={{ transform: loaded ? 'scale(1)' : 'scale(0)' }}>
            <img src={logo || '/placeholder.svg'} alt="Logo EasyFCT" />
          </div>
          <h1 className="eu-title">EasyFCT</h1>
          <div className="eu-underline" />
          <p className="eu-tagline">Tu plataforma educativa inteligente</p>
        </header>

        <section className="eu-content">
          <h2 className="eu-subtitle">Selecciona tu perfil</h2>
          <div className="eu-buttons">
            {buttons.map((b, i) => (
              <ButtonComp
                key={i}
                className={`btn--${b.text.toLowerCase()}`}
                icon={b.icon}
                onClick={() => handleButtonClick(b.route)}
                transitionDelay={`${1.4 + i * 0.1}s`}
              >
                {b.text}
              </ButtonComp>
            ))}
          </div>
        </section>

        <footer className="eu-footer">
          <p>© 2025 EasyFCT - Innovación Educativa</p>
        </footer>
      </main>
    </div>
  );
};

export default EleccionUsuario;
