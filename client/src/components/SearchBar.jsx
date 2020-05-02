import React from 'react';

import './SearchBar.css';
import { MdArrowBack } from "react-icons/md";
import { MdSearch } from "react-icons/md";

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searching: false
        };

        this.inputRef = React.createRef();
    }

    handleOnChange(event){
        if(event.target.value){
            this.setState({searching: true});
        }else{
            this.setState({searching: false});
        }
        if (event.target.value === " ") {
            this.props.GetResult("%20");
        }else{
            this.props.GetResult(event.target.value);
        }
    }


    click_icon(event){
        this.props.GetResult("");
        this.setState({searching: false});
        let input = this.inputRef.current;
        input.value = "";
    }

    render () {
        let icon;

        if (this.state.searching){
            icon = <MdArrowBack className="search_icon" onClick={event => this.click_icon(event)} />
        }else{
            icon = <MdSearch className="search_icon"/>
        }

        return(
            <div className={"search_layout"}>
               {icon}
                <form className="form-wrapper">
                    <input className = "input-field" ref={this.inputRef}
                    type = "text"
                    placeholder = "Add Tracks"
                    onChange = {event => this.handleOnChange(event)}
                    />
                </form>
            </div>
        );
    }

}
