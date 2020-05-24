import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import { HostPage } from './components/hostPage';
import  {ReduxLandingPage}  from './components/landingPage'
import {GuestPage} from './components/GuestPage'

function App() {
    return (
        <Router><div className="App">
            <Switch>

            <Route path="/host" component={HostPage}>
                <HostPage></HostPage>
            </Route>

            <Route path="/guest" component={GuestPage}>
                <GuestPage></GuestPage >
            </Route>

            <Route path="/">
                <ReduxLandingPage></ReduxLandingPage>
            </Route>

            </Switch>
        </div></Router>
    );
}

export default App;
