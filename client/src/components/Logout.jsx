import React from 'react';
import { connect } from 'react-redux';
import util from '../util'
import {
    updatePlaylist,
    play,
    pause,
    updateRoomInfo,
    updateActiveMusic,
    restoreDefault,
    updateActiveMusicState
} from '../redux/actions';


class connectLogout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount(){
        util.clearAppData()
        window.location.replace('/')
    }

    render(){
        return(<div></div>)
    }
}


export const Logout = connect(null, null)(connectLogout);
