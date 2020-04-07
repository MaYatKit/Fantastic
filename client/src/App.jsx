import React from 'react';



import './App.css';
import MusicLi from './components/MusicLi'
import SideBar from './components/SideBar';

let testMusicInfo = [
  {
    name: "Norway Ice",
    album: "Ice 2004",
    icon: "https://1.bp.blogspot.com/-PjjZ8IdgL4o/XFdM0rw8jgI/AAAAAAAAAbA/n5PceMU_W4g2qCkBL--1CN531O15GNQuACLcBGAs/s1600/bandcamp-button-square-green-256.png",
    votes: 6
  },
  {
    name: "spring",
    album: "Kobadouble",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/d5/61/db/d561dba6-9d4f-cd9a-14ac-66ef1c267523/source/256x256bb.jpg",
    votes: 0
  },
  {
    name: "Pop 2099",
    album: "Ice 2006",
    icon: "https://68ef2f69c7787d4078ac-7864ae55ba174c40683f10ab811d9167.ssl.cf1.rackcdn.com/twitter-icon_128x128.png",
    votes: 2
  }
]

let testSideBarInfo = { username: 'user1' };

function App() {
  return (
    <div className="App">
        <SideBar usename={testSideBarInfo.username}> </SideBar>
      <p>Hello World</p>
      <div style={{marginLeft: "260px"}}>
        {
          testMusicInfo.map( (entry, index) => {
            return (
              <MusicLi name={entry.name}
                album={entry.album}
                votes={entry.votes}
                icon={entry.icon}
                index={index}
                key={index}>
              </MusicLi>
            )
          })
        }
      </div>

    </div>
  );
}

export default App;
