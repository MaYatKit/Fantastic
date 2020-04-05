import React from 'react';


import style from './SideBarItem.css';


export default class SideBarItem extends React.Component {


    constructor(props) {
        super(props);
        this.state = { data: this.props.data };
    }


    itemClick(item) {
        this.props.itemOnclick(item);
    }


    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ data: nextProps.data });
    }

    render() {

        const Icon = this.props.icon;

        return (
            <div className="layout" onClick={() => this.itemClick(this.props.item)}>
                <Icon className={this.props.selected ? 'icon_selected' : 'icon'}> </Icon>
                <div className="item">
                    <span className={this.props.selected ? 'text_selected' : 'text'}>
                        {this.props.item}
                    </span>
                </div>
            </div>);
    }
}
