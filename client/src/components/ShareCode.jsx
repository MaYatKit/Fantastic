import React from "react";
import './ShareCode.css';
import {FaShareAlt} from "react-icons/fa"

class ShareCode extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };

        this.handleHover = this.handleHover.bind(this);
    }

    handleHover() {
        this.setState({hover: !this.state.hover});
    }

    render() {
        let content;
        if (this.state.hover) {
            content = "Party Code: " + this.props.partyCode;
        } else {
            content = <FaShareAlt/>;
        }

        return(
            <div className={"ShareCode-box"} onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
                <span className={"ShareCode-shareIcon"}>{content}</span>
            </div>
        );
    }
}

export default ShareCode;