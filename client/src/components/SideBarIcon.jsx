import React from 'react';

import logo from './../image/logo.png';
import sidebar_bg from './../image/sidebar_bg.png';
import './SideBarIcon.css';


export default class SideBarIcon extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userName: '123',
            roomId: 0
        };

        this.updateNameAndRoomId = this.updateNameAndRoomId.bind(this);
    }

    updateNameAndRoomId(userName, roomId) {
        this.setState({ userName: userName });
        this.setState({ roomId: roomId });
    }


    render() {
        return (
            <div className="side_bar_icon_layout">
                <img className={'side_bar_background'} src={sidebar_bg} alt={'bg'}/>
                <img className="side_bar_icon" src={logo} alt={'logo'}/>
                <div className="user_info">
                    <span className="user_name">
                        {this.props.userName + ' : ' + this.props.roomId}
                    </span>
                </div>
            </div>
        );
    }
}
