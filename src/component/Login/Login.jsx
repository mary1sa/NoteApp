import axiosInstance from "../axiosInstance";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss"
const Login = ({ setIsconnected }) => {
  const [cin, SetCin] = useState("");
  const [pass, SetPass] = useState("");
  const [formerror, setformerror] = useState({ cin: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const getData = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    
    if (!cin || !pass) {
      setformerror({
        cin: !cin ? "CIN is required" : "",
        password: !pass ? "Password is required" : "",
      });
      return;
    }

 

    setformerror({ cin: "", password: "" });

    const url = "/login";
    try {
      setLoading(true); 
      const resp = await axiosInstance.post(url, { cin: cin, password: pass });
      const data = resp.data;

      localStorage.setItem("data", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      setIsconnected(true);
      SetCin("");
      SetPass("");
     

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setformerror({
          cin: "",
          password: "Invalid CIN or password",
          
        });
        
      } else {
        setformerror({
          cin: "An error occurred. Please try again.",
          password: "",
        
        });
        

      }
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

 const changecin = (e) => {
  SetCin(e.target.value);
  setformerror({ cin: "", password: "" });
};

const changepass = (e) => {
  SetPass(e.target.value);
  setformerror({ cin: "", password: "" }); 
};

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="bodylogin">
      <div className="all">
        <div className="titlee">
          <h1>你好 </h1>
          <img src="panda.png" alt="Logo" />
        </div>
        <form className="formlogin" onSubmit={getData} > 
          <input
            value={cin}
            type="text"
            onChange={changecin}
            placeholder="CIN"
          />
          {submitted && formerror.cin && <p>{formerror.cin}</p>}

          <div style={{ position: "relative" }}>
            <input
              value={pass}
              type={showPassword ? "text" : "password"}
              onChange={changepass}
              placeholder="Password"
            />
            <button
              type="button"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
          {submitted && formerror.password && <p>{formerror.password}</p>}

         

          {loading ? (
            <button className="btnform" disabled>
              Loading...
            </button>
          ) : (
            <button className="btnform" type="submit">
              Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login; 