import React from 'react';
import style from './MliBtns.css';
import { MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';


export default class LikeBtn extends React.Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    clickHdl(event) {
        this.props.clickLike(this.props.index, !this.props.liked);
    }

    iconFn() {
        if (this.props.liked) {
            return (<MdFavorite className="icon"></MdFavorite>);
        } else {
            return (<MdFavoriteBorder className="icon"></MdFavoriteBorder>);
        }
    }

    render() {
        return (
            <div className="likebtn" onClick={this.clickHdl.bind(this)}>
                {this.iconFn()}
            </div>
        );
    }
}
