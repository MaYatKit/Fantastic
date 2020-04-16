import React from 'react';

import logo from './../image/logo.png';
import sidebar_bg from './../image/sidebar_bg.png';
import './SideBarIcon.css';


export default class SideBarIcon extends React.Component {
    render() {
        return (
            <div className="side_bar_icon_layout">
                <img className={"side_bar_background"} src={sidebar_bg} alt={"bg"}/>
                <img className="side_bar_icon" src={logo} alt={"logo"}/>
                <div className="user_info">
                    <span className="user_name">
                        {this.props.username}
                    </span>
                </div>
            </div>
        );
    }
}
