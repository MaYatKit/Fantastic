import React from 'react';
import SideBarIcon from './SideBarIcon';
import style from './SideBar.css';

import {
    MdQueueMusic,
    MdSettings,
    MdShare,
    MdTv,
    MdHome,
    MdExitToApp,
    MdHighlightOff,
} from 'react-icons/all';

import SideBarItem from './SideBarItem';


let items = [{
    item: 'Queue',
    icon: MdQueueMusic,
    to: '/main/queue'
}, {
    item: 'Settings',
    icon: MdSettings,
    to: '/main/setting'
}, {
    item: 'Share',
    icon: MdShare,
    to: '/main/share'
}, {
    item: 'TV mode',
    icon: MdTv,
    to: '/main/tv'
}, {
    item: 'Homepage',
    icon: MdHome,
    to: '/'
}, {
    item: 'Exit Party',
    icon: MdHighlightOff,
    to: '/'
}, {
    item: 'Logout',
    icon: MdExitToApp,
    to: '/main/logout'
}];


export default class SideBar extends React.Component {

    constructor(props) {
        super(props);
        this.itemOnclick = this.itemOnclick.bind(this);
        this.state = {
            data: items
        };
    }


    itemOnclick(item, changeStyle) {
        // items.map((entry, index) => {

        //     entry.selected = entry.item === item;
        // });
        // this.setState({data:items});

        // this.render();
    }

    render() {
        return (
            <div className={'side_bar'}>

                <SideBarIcon className={'side_bar_icon'}
                             username={this.props.usename}> </SideBarIcon>


                <div className={'side_bar_item_list'}>

                    {items.map((entry, index) => {
                            return (<SideBarItem
                                data = {this.state.data}
                                item={entry.item}
                                icon={entry.icon}
                                index={index}
                                to={entry.to}
                                itemOnclick={this.itemOnclick}>
                            </SideBarItem>);
                        }
                    )}
                </div>
            </div>
        );
    }
}
