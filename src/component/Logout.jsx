import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

const Logout = ({ setIsconnected }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await axiosInstance.post('/logout'); 

        console.log("Logout response:", response.data);  

        localStorage.removeItem('data'); 
        setIsconnected(false); 

        navigate('/login');
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    logoutUser();
  }, [navigate, setIsconnected]); 

  return (
    <div className="loading-text">
    <span className="dot-1">.</span>
      <span className="dot-2">.</span>
      <span className="dot-3">.</span>
    </div>
  );
};

export default Logout;
