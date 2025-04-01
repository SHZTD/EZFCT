import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Offers.css";

const Offers = () => {
  const [activeTab, setActiveTab] = useState("offers");
  const navigate = useNavigate();

  return (
    <div className="offers-container">
      {/* Header */}
      <div className="offers-header">
        <h1>OFFERS</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`tab-button ${activeTab === "offers" ? "active" : ""}`}
          onClick={() => setActiveTab("offers")}
        >
          <img src="/paper.png" alt="Offers" className="tab-icon" />
          Offers
        </button>
        <button
          className={`tab-button ${activeTab === "students" ? "active" : ""}`}
          onClick={() => navigate("/empresa/Estudiantes")}
        >
          <img src="/users.png" alt="Students" className="tab-icon" />
          Students
        </button>
        <button
          className={`tab-button ${activeTab === "help" ? "active" : ""}`}
          onClick={() => navigate("/empresa/Help")}
        >
          <img src="/question.png" alt="Help" className="tab-icon" />
          Help
        </button>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <div className="form-card">
          <h2>¡Oferta Publicada!</h2>
          <button className="botonn" onClick={() => navigate("/empresa/Inicio")}>
            VOLVER A PUBLICAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Offers;
