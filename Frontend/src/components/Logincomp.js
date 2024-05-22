import React, { useState } from "react";
import Topbar from "./Topbar";
import "./Logincomp.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import mainIP from "../constant";

const Logincomp = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [subscriptionOptions, setSubscriptionResponseOptions] = useState([]);
  // const navigate = useNavigate();
  const convertData1 = (data) => {
    const convertedData = [];
    for (const key in data) {
      convertedData.push({
        key: key,
        text: data[key],
        value: data[key],
      });
    }
    return convertedData;
  };
  const handleSubscriptionButtonClick = () => {
    console.log(mainIP);
    fetch(`${mainIP}/subscription`)
      .then((response) => response.json())
      .then((data) => {
        props.setSubscriptionResponseOptions(convertData1(data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const navigate = useNavigate();
  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Redirecting to authentication page");
    }
    navigate("/landing");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (isLoggedIn) {
    // Render the logged-in content
    return (
      <div className="login-board">
        <div className="dashboard">
          <div className="row top-section">
            <div className="col-12 remove-padding">
              <Topbar />
            </div>
          </div>
          <div className="row bottom-section">
            <button onClick={handleLogout}>Logout</button>
            <p>Welcome, {username}!</p>
            {/* Add the rest of the logged-in content */}
          </div>
        </div>
      </div>
    );
  }

  // Render the login form
  return (
    <div className="login-board">
      <div className="dashboard">
        <div className="row top-section">
          <div className="col-12 remove-padding">
            <Topbar />
          </div>
        </div>
        <div className="row bottom-section">
          <div className="login-section">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled
            />
            <div className="logintest-heading">Click here to authenticate</div>
            <div className="Login-button">
              <button
                className="login-btn btn btn-primary"
                onClick={() => (handleSubscriptionButtonClick(), handleLogin())}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logincomp;
