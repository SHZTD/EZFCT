import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ButtonComp from '../../../../Components/JSX/ButtonComp.js';
import LogoDefault from '../../../Imagenes/logo.gif';
import { useNavigate } from 'react-router-dom';
import '../CSS/Login.css';


const Login = ({ onLogin = () => { }, onBack = () => { }, logo }) => {
  // Estados para el formulario
  let API_URL = "http://192.168.1.139:7484/auth/userlogin";

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Referencias para elementos DOM
  const particlesContainerRef = useRef(null);
  const formRef = useRef(null);

  // Efecto para la animación de entrada
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

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      // Efecto de vibración si faltan campos
      formRef.current.classList.add('shake');
      setTimeout(() => {
        formRef.current.classList.remove('shake');
      }, 500);
      return;
    }

    // Efecto de explosión de partículas
    createExplosionEffect(mousePosition.x, mousePosition.y, '#3b82f6');

    // Llamar a la función de login
    setTimeout(() => {
      onLogin({ email, password });
    }, 300);
  };

  // Manejar clic en botón de volver
  const handleBack = () => {
    createExplosionEffect(50, 50, '#f43f5e');
    setTimeout(() => navigate(-1), 300);
  };

  const guardarToken = (token) => {
    localStorage.setItem('token', token);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      formRef.current.classList.add('shake');
      setTimeout(() => {
        formRef.current.classList.remove('shake');
      }, 500);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        guardarToken(data.token);
        console.log('Token guardado:', data.token);
        navigate('/alumnos/ofertas');
      } else {
        const errorText = await response.text();
        alert('Error al iniciar sesión: ' + errorText);
      }
    } catch (error) {
      alert('Error de red: ' + error.message);
    }
  };

  return (
    <div className="login-container">
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

      {/* Efecto de luz que sigue al cursor */}
      <div
        className="cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Botón de volver atrás */}
      <button
        className={`back-button ${loaded ? 'loaded' : ''}`}
        onClick={handleBack}
        aria-label="Volver"
      >
        ←
      </button>

      {/* Contenedor principal */}
      <div className={`login-card ${loaded ? 'loaded' : ''}`}>
        {/* Sección del logo */}
        <div className="logo-section">
          {/* Círculos decorativos */}
          <div className="decorative-circle circle-1" />
          <div className="decorative-circle circle-2" />

          {/* Logo con animación */}
          <div className={`logo-container ${loaded ? 'loaded' : ''}`}>
            <img src={logo || LogoDefault} className="logo" />
          </div>

          {/* Título y subtítulo */}
          <h1 className={`title ${loaded ? 'loaded' : ''}`}>EasyFCT</h1>
          <div className={`divider ${loaded ? 'loaded' : ''}`} />
          <p className={`subtitle ${loaded ? 'loaded' : ''}`}>Accede a tu cuenta</p>

          {/* Línea decorativa */}
          <div className={`gradient-line ${loaded ? 'loaded' : ''}`} />
        </div>

        {/* Formulario */}
        <form className="form-container" onSubmit={handleSubmit} ref={formRef}>
          {/* Campo de email */}
          <div className={`input-group ${loaded ? 'loaded' : ''}`} style={{ transitionDelay: '1.3s' }}>
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                id="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className={`input-group ${loaded ? 'loaded' : ''}`} style={{ transitionDelay: '1.4s' }}>
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>
          </div>

          {/* Enlace de olvidé mi contraseña */}
          <div className={`forgot-password ${loaded ? 'loaded' : ''}`}>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón de login usando ButtonComp */}
          <div className={`button-container ${loaded ? 'loaded' : ''}`}>
            <ButtonComp
              className="btn--login"
              icon="🔑"
              onClick={handleLogin}
              transitionDelay="1.6s"
            >
              Iniciar Sesión
            </ButtonComp>
          </div>
        </form>

        {/* Pie de página */}
        <div className="footer">
          <p className={loaded ? 'loaded' : ''}>© 2025 EasyFCT - Innovación Educativa</p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func,
  onBack: PropTypes.func,
  logo: PropTypes.string,
};

export default Login;