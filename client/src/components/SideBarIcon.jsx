import React from 'react';


import { MdAcUnit } from 'react-icons/all';
import style from './SideBarIcon.css';


export default class SideBarIcon extends React.Component {


    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="side_bar_icon_layout">
                <div className="img">
                    <img className="side_bar_icon" src={"https://d33wubrfki0l68.cloudfront.net/1967c0923ec2039f845c917dae55fa32f0b73e74/ca447/img/festify-logo.svg"}/>
                </div>
                <div className="user_info">
                    <span className="user_name">
                        {this.props.username}
                    </span>
                </div>
            </div>);
    }
}
