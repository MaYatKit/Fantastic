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
    selected: true
}, {
    item: 'Settings',
    icon: MdSettings,
    selected: false
}, {
    item: 'Share',
    icon: MdShare,
    selected: false
}, {
    item: 'TV mode',
    icon: MdTv,
    selected: false
}, {
    item: 'Homepage',
    icon: MdHome,
    selected: false
}, {
    item: 'Exit Party',
    icon: MdHighlightOff,
    selected: false
}, {
    item: 'Logout',
    icon: MdExitToApp,
    selected: false
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
        items.map((entry, index) => {

            entry.selected = entry.item === item;
        });
        this.setState({data:items});

        // this.render();
    }

    render() {
        return (
            <div className={'side_bar'}>

                <SideBarIcon className={'side_bar_icon'}
                             username={this.props.username}> </SideBarIcon>


                <div className={'side_bar_item_list'}>

                    {items.map((entry, index) => {
                            return (<SideBarItem
                                data = {this.state.data}
                                item={entry.item}
                                icon={entry.icon}
                                index={index}
                                selected={entry.selected}
                                itemOnclick={this.itemOnclick}>
                            </SideBarItem>);
                        }
                    )}
                </div>
            </div>
        );
    }
}
