import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../CSS/Estudiantes.css';

const Estudiantes = () => {
  const [students, setStudents] = useState([
    { name: 'Michal Jack', time: '28 mins ago', avatar: '', selected: false },
    { name: 'Michal Jack', time: '28 mins ago', avatar: '', selected: false },
    { name: 'Michal Jack', time: '28 mins ago', avatar: '', selected: true },
  ]);

  const selectStudent = (index) => {
    const updatedStudents = students.map((student, i) => ({
      ...student,
      selected: i === index
    }));
    setStudents(updatedStudents);
  };

  return (
    <div className="students-container">
      <div className="students-header">
        <h1>STUDENTS</h1>
      </div>

      <div className="nav-tabs">
        <NavLink 
          to="/empresas/OfertasE" 
          className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
        >
          <img src="/paper.png" alt="Offers" className="tab-icon" />
          <span>Offers</span>
        </NavLink>

        <NavLink 
          to="/empresas/Estudiantes"
          className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
        >
          <img src="/users.png" alt="Students" className="tab-icon" />
          <span>Students</span>
        </NavLink>

        <NavLink 
          to="/empresas/Help"
          className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
        >
          <img src="/question.png" alt="Help" className="tab-icon" />
          <span>Help</span>
        </NavLink>
      </div>

      <div className="students-grid">
        <div className="grid-row">
          {students.map((student, index) => (
            <div key={index} className="grid-col">
              <div 
                className={`student-card ${student.selected ? 'selected' : ''}`}
                onClick={() => selectStudent(index)}
              >
                <div className="student-avatar">
                  <img src={student.avatar} alt="Student avatar" />
                </div>
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p>{student.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Estudiantes;