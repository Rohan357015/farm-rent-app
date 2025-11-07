import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/landingPage.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </div>
  );
}

export default App;
