import React from 'react';
//import './App.css';
import LandingPage from "./components/landingPage.jsx";
import HostPage from "./components/hostPage";

Playback.init();

function App() {
  return (
    <div className="App">
      <HostPage />
    </div>
  );
}

export default App;
