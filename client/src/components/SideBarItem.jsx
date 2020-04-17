import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';


import style from './SideBarItem.css';


export default class SideBarItem extends React.Component {


    constructor(props) {
        super(props);
        this.state = { data: this.props.data };
    }


    // itemClick(item) {
    //     this.props.itemOnclick(item);
    // }


    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ data: nextProps.data });
    }

    render() {

        const Icon = this.props.icon;

        return (
            <NavLink exact  className="layout" to={this.props.to} activeClassName="active">
                <Icon className={'icon'}> </Icon>
                <div className="item">
                    <span className={'text'}>
                        {this.props.item}
                    </span>
                </div>
            </NavLink>);
    }
}
