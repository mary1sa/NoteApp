import React, { useState } from "react";
import { BrowserRouter,  Navigate, Route, Routes } from "react-router-dom";
import Login from "./component/Login/Login";
import './stylenote.scss';
import List from "./component/List";
import CreateNote from "./component/CreateNote";
import ResetPassword from "./component/ResetPassword";
import Logout from "./component/Logout"; 
import Navbar from "./component/Navbar/Navbar";


function App() {
  const [isconnect, setIsconnected] = useState(() => {
    const token = localStorage.getItem('data');
    return token ? true : false;
  });

  return (
    <div className="App">
      <BrowserRouter>
        {isconnect && (
         <Navbar isconnect={isconnect} />
        )}

        <Routes>
          <Route 
            path="/login" 
            element={isconnect ? <Navigate to="/" /> : <Login setIsconnected={setIsconnected} />} 
          />
          <Route path="/" element={isconnect ?<List />: <Navigate to="/login" /> } />
          <Route path="/addnotes" element={isconnect ? <CreateNote /> : <Navigate to="/login" />} />
          <Route path="/reset-password" element={isconnect ? <ResetPassword /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<Logout setIsconnected={setIsconnected} />} /> 
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
