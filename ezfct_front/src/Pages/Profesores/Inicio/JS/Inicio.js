import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../Imagenes/logo.gif';
import ButtonComp from '../../../../Components/JSX/ButtonComp.js';
import '../CSS/Inicio.css';

const Inicio = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [hoverBack, setHoverBack] = useState(false);

  // arrancar animaciones y partículas
  useEffect(() => {
    setLoaded(true);
    const initial = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
      color: ['#3b82f6','#10b981'][Math.floor(Math.random()*2)],
    }));
    setParticles(initial);
    const animate = () => setParticles(p =>
      p.map(pt => ({
        ...pt,
        x: (pt.x + pt.speedX + window.innerWidth) % window.innerWidth,
        y: (pt.y + pt.speedY + window.innerHeight) % window.innerHeight,
      }))
    );
    const id = setInterval(animate, 50);
    const move = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => {
      clearInterval(id);
      window.removeEventListener('mousemove', move);
    };
  }, []);

  const handleBack = () => {
    // explosión y regreso
    const explosion = Array.from({ length: 20 }, () => ({
      x: mousePos.x,
      y: mousePos.y,
      size: Math.random()*6+2,
      speedX: (Math.random()-0.5)*10,
      speedY: (Math.random()-0.5)*10,
      opacity: 1,
      color: '#f43f5e',
    }));
    setParticles(p => [...p, ...explosion]);
    setTimeout(() => navigate(-1), 300);
  };

  const actions = [
    { text: 'Login',    route: '/profesores/login',    icon:'🔑'},
    { text: 'Register', route: '/profesores/register', icon:'✨'}
  ];

  return (
    <div className="inicio-container">
      {particles.map((pt,i)=>(
        <div
          key={i}
          className="inicio-particle"
          style={{ left:`${pt.x}px`, top:`${pt.y}px`, width:`${pt.size}px`, height:`${pt.size}px`, backgroundColor:pt.color, opacity:pt.opacity }}
        />))}
  

      {/* botón volver atrás */}
      <button
        className={`inicio-back ${hoverBack?'hover':''}`}
        onClick={handleBack}
        onMouseEnter={()=>setHoverBack(true)}
        onMouseLeave={()=>setHoverBack(false)}
        style={{ transform: loaded?'scale(1)':'scale(0)', opacity: loaded?1:0 }}
      >←</button>

      <div className={`inicio-main ${loaded?'loaded':''}`}>
        <div className="inicio-header">
          <div className="inicio-circle c1" />
          <div className="inicio-circle c2" />
          <div className="inicio-logo">
            <img src={logo} alt="Logo" />
          </div>
          <h1 className="inicio-title">EasyFCT</h1>
          <p className="inicio-tagline">Bienvenido a tu plataforma educativa</p>
        </div>

        <div className="inicio-content">
          <div className="inicio-buttons">
            {actions.map((btn,i)=>(
              <ButtonComp
                key={i}
                className={`btn--${btn.route}`}
                icon={btn.icon}
                onClick={()=>navigate(btn.route)}
                transitionDelay={`${1.4 + i*0.1}s`}
              >{btn.text}</ButtonComp>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;