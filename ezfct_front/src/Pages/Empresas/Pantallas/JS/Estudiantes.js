// src/pages/empresa/CreacionOfertas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavTabs from '../../../../Components/JSX/NavTabs.js';
import ButtonComp from '../../../../Components/JSX/ButtonComp.js';
import '../CSS/CreacionOfertas.css';

import paperIcon from '../../../Imagenes/paper.png';
import usersIcon from '../../../Imagenes/users.png';
import questionIcon from '../../../Imagenes/question.png';

const CreacionOfertas = () => {
  const [activeTab, setActiveTab] = useState('offers');
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    title: '', description: '', skills: '', direction: '', vacancies: '1'
  });
  const navigate = useNavigate();

  // Inicialización entradas y partículas
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    createInitialParticles();
    const onMove = e => setMousePosition({ x: e.pageX, y: e.pageY });
    window.addEventListener('mousemove', onMove);
    const interval = setInterval(animateParticles, 50);
    window.addEventListener('resize', createInitialParticles);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', createInitialParticles);
      clearInterval(interval);
    };
  }, []);

  const createInitialParticles = () => {
    const cols = ['#3b82f6','#10b981','#f59e0b','#8b5cf6'];
    setParticles(Array.from({ length: 50 }, () => ({
      id: Math.random().toString(36).slice(2),
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      size: Math.random()*5+1,
      speedX: (Math.random()-0.5)*2,
      speedY: (Math.random()-0.5)*2,
      opacity: Math.random()*0.5+0.1,
      color: cols[Math.floor(Math.random()*4)]
    })));
  };

  const animateParticles = () => {
    setParticles(ps => ps.map(p => ({
      ...p,
      x: (p.x + p.speedX + window.innerWidth) % window.innerWidth,
      y: (p.y + p.speedY + window.innerHeight) % window.innerHeight,
    })));
  };

  const createExplosion = (x, y, color) => {
    const ex = Array.from({ length: 30 }, () => ({
      id: Math.random().toString(36).slice(2),
      x,y,
      size: Math.random()*8+2,
      speedX: (Math.random()-0.5)*15,
      speedY: (Math.random()-0.5)*15,
      opacity: 1, color
    }));
    setParticles(ps => [...ps, ...ex]);
    setTimeout(() => setParticles(ps => ps.slice(0,50)), 1000);
  };

  const handleTabChange = (key, route) => {
    setActiveTab(key);
    createExplosion(mousePosition.x, mousePosition.y, '#f59e0b');
    setTimeout(() => navigate(route), 300);
  };

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const publishOffer = () => {
    const { title, description, skills, direction } = formData;
    if (!title || !description || !skills || !direction) {
      document.querySelector('.form-card')?.classList.add('shake');
      return setTimeout(() => document.querySelector('.form-card')?.classList.remove('shake'), 500);
    }
    createExplosion(mousePosition.x, mousePosition.y, '#10b981');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/empresas/ofertasP');
    }, 1500);
  };

  if (isLoading) return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Publicando . . .</p>
      </div>
    </div>
  );

  const tabs = [
    { key: 'offers', icon: paperIcon, label: 'Offers', route: '/empresas/OfertasE' },
    { key: 'students', icon: usersIcon, label: 'Students', route: '/empresas/Estudiantes' },
    { key: 'help', icon: questionIcon, label: 'Help', route: '/empresa/Help' },
  ];

  return (
    <div className="offers-page">
      {/* Partículas de fondo */}
      <div className="particles-container">
        {particles.map(p => (
          <div key={p.id} className="particle" style={{
            left:`${p.x}px`, top:`${p.y}px`, width:`${p.size}px`,
            height:`${p.size}px`, backgroundColor:p.color, opacity:p.opacity
          }}/>
        ))}
      </div>

      {/* Luz al cursor */}
      <div
        className="cursor-light"
        style={{ left:`${mousePosition.x}px`, top:`${mousePosition.y}px` }}
      />

      <div className="offers-container">
        <div className={`offers-header ${loaded?'loaded':''}`}>…</div>

        {/* Aquí NavTabs */}
        <NavTabs
          activeTab={activeTab}
          loaded={loaded}
          tabs={tabs}
          onTabChange={handleTabChange}
        />

        {/* Formulario */}
        <div className="form-content">
          <div className={`form-card ${loaded?'loaded':''}`}>
            <h2 className="form-title">Create New Offer</h2>
            {/* … campos con handleInput … */}
            <ButtonComp
              className="publish-button"
              icon="✈️"
              onClick={publishOffer}
            >
              Publish Offer
            </ButtonComp>
          </div>
        </div>

        <footer className="footer">
          <p className={loaded?'loaded':''}>© 2025 EasyFCT – Innovación Educativa</p>
        </footer>
      </div>
    </div>
  );
};

export default CreacionOfertas;
