import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";

import React from 'react';

import Header from "./components/Header";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Error from "./components/Error";
import Settings from "./components/Settings";
import Feed from "./components/Feed";

import "./assets/css/styles.css";

function App() {

  const location = useLocation();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/404") {
      setIsLogged(false);
    } else if (location.pathname === "/settings" || location.pathname === "/publications") {
      setIsLogged(true);
    }
  }, [location]);

  return (
    <div className="App">
      <Header
        props_isLogged={isLogged}
      />

      <main>
        <Routes>
          <Route path="*" element={<Navigate to="/404" replace />} />
          <Route exact path="/" element={<Navigate to="/login" replace />} />
          <Route path="404" element={<Error />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="settings" element={<Settings />} />
          <Route path="publications" element={<Feed />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

// Function which for a given RegEx, input ID and error message check if the corresponding input (id) format (RexEx) is correct and alert the user trough an error message
export const handleErrorMessage = (isErroneous, inputsIDName, errorMessage) => {
  if (isErroneous) {
    document.getElementById(inputsIDName + "ErrorMsg").innerHTML = errorMessage;
    document.getElementById(inputsIDName + "ErrorMsg").setAttribute("aria-describedby", errorMessage);
    document.getElementById(inputsIDName + "ErrorMsg").setAttribute("role", "alert");
    document.getElementById(inputsIDName).style.boxShadow = "0 0 0.5em #9E0000";
    document.getElementById(inputsIDName + "ErrorMsg").style.color = "#9E0000";
    document.getElementById(inputsIDName).style.borderBottom = "none";
  } else {
    document.getElementById(inputsIDName + "ErrorMsg").innerHTML = errorMessage;
    document.getElementById(inputsIDName + "ErrorMsg").removeAttribute("aria-describedby");
    document.getElementById(inputsIDName + "ErrorMsg").removeAttribute("role");
    document.getElementById(inputsIDName).style.borderBottom = "2px solid #135A71";
    document.getElementById(inputsIDName).style.boxShadow = "none";
  }
};