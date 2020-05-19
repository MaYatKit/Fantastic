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


let host_items = [{
    item: 'Queue',
    icon: MdQueueMusic,
    to: '/host'
}, {
    item: 'Settings',
    icon: MdSettings,
    to: '/host/setting'
}, {
    item: 'Share',
    icon: MdShare,
    to: '/host/share'
}, {
    item: 'Exit Party',
    icon: MdHighlightOff,
    to: '/'
}];

let guest_items = [{
    item: 'Queue',
    icon: MdQueueMusic,
    to: '/guest'
}, {
    item: 'Settings',
    icon: MdSettings,
    to: '/guest/setting'
}, {
    item: 'Share',
    icon: MdShare,
    to: '/guest/share'
}, {
    item: 'Exit Party',
    icon: MdHighlightOff,
    to: '/'
}];

export default class SideBar extends React.Component {

    constructor(props) {
        super(props);
        this.itemOnclick = this.itemOnclick.bind(this);
        this.state = {
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
        let items = this.props.isGuest ? guest_items : host_items
        return (
            <div className={'side_bar'}>

                <SideBarIcon className={'side_bar_icon'}
                             userName={this.props.userName} roomId = {this.props.roomId}> </SideBarIcon>


                <div className={'side_bar_item_list'}>

                    {items.map((entry, index) => {
                            return (<SideBarItem
                                data = {this.state.data}
                                item={entry.item}
                                icon={entry.icon}
                                index={index}
                                key={index}
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
