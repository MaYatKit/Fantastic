import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';

import './App.css';
import MusicLiWrapper from './components/MusicLiWrapper'
import SideBar from './components/SideBar';
import * as Playback from './playBack';

let testSideBarInfo = { username: 'user1' };

Playback.init();

function App() {
    return (
        <Router><div className="App">
            <Switch>

            <Route path="/main">
                <SideBar usename={testSideBarInfo.username}> </SideBar>
                <MusicLiWrapper></MusicLiWrapper>
            </Route>

            <Route path="/">
                <p>Landing Page</p>
                <p style={{textAlign: "center"}}>
                    <NavLink to={`main`}>Content Page</NavLink>
                </p>
            </Route>

            </Switch>
        </div></Router>
    );
}

export default App;
