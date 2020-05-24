import React from 'react';

import style from "./MliBtns.css"


import {MdSkipNext} from "react-icons/md"
import {MdClear} from "react-icons/md"



export default class MusicLi extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    iconFn(){
        if(this.props.type === "NEXT")
            return (<MdSkipNext className="icon"></MdSkipNext>)
        else
            return (<MdClear className="icon"></MdClear>)
    }

    render(){
        return (
            <div className="likebtn"
                onClick={ e => this.props.parentHandler(this.props.type) }>
                { this.iconFn() }
            </div>
        );
    }
}
