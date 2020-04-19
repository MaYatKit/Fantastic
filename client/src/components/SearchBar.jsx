import React from 'react';

import './SearchBar.css';
import { MdArrowBack } from "react-icons/md";
import { MdAlbum } from "react-icons/md";

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searching: false
        };
    }

    handleKeyPress(event) {
        return (event.target.value.match(/[A-Za-z0-9]+/g));
    }

    handleOnChange(event){
        if(event.target.value){
            this.setState({searching: true});
        }else{
            this.setState({searching: false});
        }

        event.target.value.replace(/\s/g, "%20");
        this.props.GetResult(event.target.value);
    }

    render () {
        let icon;

        if (this.state.searching){
            icon = <MdArrowBack className="icon" />
        }else{
            icon = <MdAlbum className="icon"/>
        }

        return(
            <div>
                <form className="form-wrapper">
                    <div className={"image"}>{ icon }</div>
                    <input className = "input-field"
                    onKeyPress={event => this.handleKeyPress(event)}
                    type = "text"
                    placeholder = "Add Tracks"
                    onChange = {event => this.handleOnChange(event)}
                    />
                </form>
            </div>
        );
    }

}