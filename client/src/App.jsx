import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';

import './App.css';
import MusicLiWrapper from './components/MusicLiWrapper'
import SideBar from './components/SideBar';
import * as Playback from './playBack';
import oauth from './oauth'

let testSideBarInfo = { username: 'user1' };

Playback.init();
window.oauth = oauth;   // for test use

function App() {
  return (
      <div className="App">
        <HostPage />
      </div>
  );
}

export default App;
