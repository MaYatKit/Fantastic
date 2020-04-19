import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';
import MusicLiWrapper from './MusicLiWrapper'
import SideBar from './SideBar';

export default class SideBarItem extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
        <div>
            <SideBar usename={"666"} isGuest={true}> </SideBar>
            <MusicLiWrapper></MusicLiWrapper>
        </div>
            );
    }
}
