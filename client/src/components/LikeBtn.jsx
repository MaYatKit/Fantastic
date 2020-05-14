import React from 'react';
import style from "./MliBtns.css"
// import icons
import {FiPlus} from "react-icons/fi"
import {MdFavorite} from "react-icons/md"
import {MdFavoriteBorder} from "react-icons/md"


export default class LikeBtn extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    clickHdl(event){
        this.props.clickLike()
    }

    iconFn(){
        if(!this.props.liked && this.props.votes === 0)
            return (<FiPlus className="icon"></FiPlus>)

        else if(!this.props.liked && this.props.votes !== 0)
            return (<MdFavoriteBorder className="icon"></MdFavoriteBorder>)

        else if (this.props.liked)
            return (<MdFavorite className="icon"></MdFavorite>)
    }

    render(){
        return (
        <div className="likebtn" onClick={this.clickHdl.bind(this)}>
            { this.iconFn() }
        </div>
        );
    }   
}
