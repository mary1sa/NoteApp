import React, { useState } from "react";
import axiosInstance from "./axiosInstance";
import {  useNavigate } from "react-router-dom";
import "./Login/Login.scss"

const ResetPassword = ( {setIsconnected}) => {
  const [currentPassword, setCurrentPassword] = useState("");  
  const [newPassword, setNewPassword] = useState("");         
  const [confirmPassword, setConfirmPassword] = useState("");  
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState("");

  const navigate = useNavigate();

  const setPassword = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (value.length >= 8) {
      setStrength("strong");
    } else if (value.length >= 5) {
      setStrength("medium");
    } else {
      setStrength("weak");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      
    }

    if (newPassword.length < 5) {
      setMessage("Password must be at least 5 characters long.");
      
    }


    try {
      const url = "/update-password";
      const response = await axiosInstance.put(
        url,
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }
      );
      if (response.status === 200) {
        setMessage("Password successfully reset!");
        setTimeout(() => {
          setIsconnected(false);
          navigate("/login");         
        }, 2000);
      } else {
        setMessage("An error. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setMessage("Current password is incorrect.");
        } else {
          setMessage("An error. Please try again.");
        }
      } else {
        setMessage("An error. Please try again.");
      }
      console.error("Error Response:", error.response);
    } 
  };

  const getPasswordBorderColor = () => {
    if (strength === "strong") return "green";
    if (strength === "medium") return "orange";
    return "red"; 
  };

  return (
    <div className="bodycenter">
      <div className="all">
        
          <h1>Reset Password</h1>
          {/* {message && <p>{message}</p>}  */}
          <form className="formlogin" onSubmit={handleResetPassword}>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Current password"
            />

            <input
              type="password"
              value={newPassword}
              onChange={setPassword} 
              required
              placeholder="New Password"
              style={{
                borderColor: getPasswordBorderColor(),
                borderWidth: "2px",
                borderStyle: "solid",
              }}
            />

            {newPassword.length !== 0 && (
              <p style={{ color: getPasswordBorderColor() }}>{strength}</p>
            )}

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
              style={{
                borderColor: getPasswordBorderColor(),
                borderWidth: "2px",
                borderStyle: "solid",
              }}
            />
             {message && <p>{message}</p>} 
            <br />
            <button className="btnform" type="submit">
            Reset Password
            </button>
           
          </form>
        </div>
      </div>
    
  );
};

export default ResetPassword;
