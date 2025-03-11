import React from 'react'
import { useNavigate } from "react-router-dom";

export const ButtonComp = ({ text, route, className =""}) => {
  const navigate = useNavigate();
  return (
    <button type="button" className={`ButtonComponent ${className}`} onClick={()=>navigate(route)}>{text}</button>
  );
};