import React from 'react';
import "./button.css";
import { Link} from "react-router-dom";

class Button extends React.Component{
    render() {
        if (this.props.pos === 1){
            return (
                <button className={`button animateIn ${this.props.type}`} >
                    <Link to ='/host'>{this.props.name}</Link>
                </button>
            );
        } else if (this.props.pos != null) {
            return (
                <button className={`button animateIn ${this.props.type}`}
                    onClick={() => this.props.changePagePosition(this.props.pos)}
                    disabled={this.props.disable}>
                    <span>{this.props.name}</span>
                </button>
            );
        } else {
            return (
                <button className={`button ${this.props.type}`}>
                    <span>{this.props.name}</span>
                </button>
            );
        }
    }
}

export default Button;
