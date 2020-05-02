import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';

import './App.css';
import { HostPage } from './components/hostPage';
import  {ReduxLandingPage}  from './components/landingPage'
import {GuestPage} from './components/GuestPage'
import * as Playback from './playBack';
// import oauth from './oauth'
import api from './api'

window.api = api;
let testSideBarInfo = { username: 'user1' };

// Playback.init();

function App() {
    return (
        <Router><div className="App">
            <Switch>

            <Route path="/host" component={HostPage}>
                <HostPage></HostPage>
            </Route>

            <Route path="/guest">
                <GuestPage></GuestPage>
            </Route>

            <Route path="/">
                <div style={
                    {"position": "absolute",
                    "color": "white",
                    "top": 0,
                    "textAlign": "center",
                    "width": "100%"}}>
                    <NavLink to={`host`} style={{color: "white"}}>Host Page</NavLink>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <NavLink to={`guest`} style={{color: "white"}}>Guest Page</NavLink>
                </div>
                <ReduxLandingPage></ReduxLandingPage>
            </Route>

            </Switch>
        </div></Router>
    );
}

export default App;
