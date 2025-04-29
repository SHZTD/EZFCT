import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../CSS/ButtonComp.css';

/**
 * ButtonComp - un componente de botón reutilizable con variantes y animaciones.
 *
 * Props:
 * - className: string de clases CSS adicionales (por ejemplo 'btn--empresa').
 * - icon: nodo (emoji o SVG) que se mostrará antes del texto.
 * - onClick: función callback cuando se hace clic.
 * - transitionDelay: cadena CSS para retrasar la animación del botón.
 * - children: contenido (texto) del botón.
 * - ...rest: cualquier otra prop válida de <button> (disabled, type, id…).
 */
const ButtonComp = ({
  className = '',          // Clases CSS personalizadas para variantes
  icon = null,             // Icono que se muestra antes del texto (opcional)
  onClick = () => {},      // Callback para el evento onClick
  transitionDelay = '0s',   // Retraso de la transición CSS
  children,                // Texto o contenido del botón
  ...rest                  // Resto de props aplicadas directamente al <button>
}) => {
  // Estado para controlar si el ratón está encima del botón
  const [hovered, setHovered] = useState(false);

  return (
    <button
      // Combinamos clases: base 'btn', la variante, y 'btn--hover' si está hovered
      className={`btn ${className} ${hovered ? 'btn--hover' : ''}`}
      // Al entrar el ratón, marcamos hovered = true
      onMouseEnter={() => setHovered(true)}
      // Al salir el ratón, marcamos hovered = false
      onMouseLeave={() => setHovered(false)}
      // Ejecutamos la función pasada via prop
      onClick={onClick}
      // Aplicamos el retraso de transición (por ejemplo para animación de aparición)
      style={{ transitionDelay }}
      // Props extra como disabled, type, id, etc., se extienden aquí
      {...rest}
    >
      {/* Capa de brillo animada usando CSS */}
      <span className="btn__shine" />
      {/* Icono opcional antes del texto */}
      {icon && <span className="btn__icon">{icon}</span>}
      {/* Contenido principal del botón */}
      {children}
      {/* Flecha que aparece en hover */}
      <span className="btn__arrow">→</span>
    </button>
  );
};

// Definición de tipos para props y requeridos
ButtonComp.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  transitionDelay: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Exportamos el componente para usarlo en otras partes de la app
export default ButtonComp;
