import React from 'react';
import './App.css';
import MusicLiWrapper from './components/MusicLiWrapper'
import SideBar from './components/SideBar';
import * as Playback from './playBack';

let testSideBarInfo = { username: 'user1' };

Playback.init();

function App() {
    return (
        <div className="App">
            <SideBar usename={testSideBarInfo.username}> </SideBar>
            <MusicLiWrapper></MusicLiWrapper>
        </div>
    );
}

export default App;
