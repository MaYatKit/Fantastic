import React from 'react';
import "./button.css";

class Button extends React.Component{
    render() {
        if (this.props.pos != null) {
            return (
                <button className={`button animateIn ${this.props.type}`} onClick={() => this.props.changePagePosition(this.props.pos)}><span>{this.props.name}</span></button>
            );
        } else {
            return (
                <button className={`button ${this.props.type}`}><span>{this.props.name}</span></button>
            );
        }
    }
}

export default Button;