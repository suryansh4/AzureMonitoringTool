import ResponsiveDrawer from "./pages/Dashboard";
import React, { useState } from 'react';
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import React, { Component, useState } from "react";
import Logincomp from "./components/Logincomp";
// const subscriptions = ["Subscription 1", "Subscription 2", "Subscription 3"];
// const resourceGroups = [
//   "Resource Group 1",
//   "Resource Group 2",
//   "Resource Group 3",
// ];
// const resources = ["Resource 1", "Resource 2", "Resource 3", "Resource 4"];
// const otherOptions = ["Option 1", "Option 2", "Option 3"];
 
const App = () => {
  const [subscriptionOptions, setSubscriptionResponseOptions] = useState([]);
  return (
    <div>
        <Routes>
          <Route path="/" element={<Logincomp setSubscriptionResponseOptions = {setSubscriptionResponseOptions}/>}></Route>
          <Route path="/landing" element={<Dashboard subscriptionOptions={subscriptionOptions}/>}></Route>
        </Routes>
    </div>
  );
};

export default App;
