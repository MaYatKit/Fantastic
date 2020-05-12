import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';


import './SideBarItem.css';


export default class SideBarItem extends React.Component {


    constructor(props) {
        super(props);
        this.state = { data: this.props.data };
    }


    itemClick(item) {
        // this.props.itemOnclick(item);
    }


    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ data: nextProps.data });
    }

    render() {

        const Icon = this.props.icon;

        return (
            <NavLink to={this.props.to} exact className={"layout"} activeClassName="select">
                <Icon className={this.props.selected ? 'icon_selected' : 'icon'}> </Icon>
                <div className="item">
                    <span className={'text'}>
                        {this.props.item}
                    </span>
                </div>
            </NavLink>);
    }
}
