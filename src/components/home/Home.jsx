import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ChatScreen from "./ChatScreen";
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";
import useWebRtc from "../../hook/UseWebRtc";

function Home() {
    const {username} = useParams();
    const [id, setId] = useState(0);
    const [channelName, setChannelName] = useState("");
    const [channelList, setChannelList] = useState([]);
    const [myCameraState, setMyCameraState] = useState(true);
    const [myMikeState, setMyMikeState] = useState(true);
    const [
        peerStreamList,
        sendJoin,
        leaveChannel,
        _,
        ready,
        localStream,
    ] = useWebRtc({username, id, myCameraState, myMikeState, setChannelList});

    const setChannel = (id) => {
        if (id !== 0) {
            leaveChannel();
        }
        sendJoin(id);
        setId(id);
        setChannelName(channelList.map(channel => {
            if (channel.id === id) {
                return channel.name
            }
        }))
    }
    
    return (
            ready ?
            <div className="home">
                <Sidebar username={username} 
                    setMyMikeState={() => setMyMikeState(!myMikeState)} myMikeState={myMikeState}
                    setMyCameraState={() => setMyCameraState(!myCameraState)} myCameraState={myCameraState}
                    setChannelName={setChannelName} setChannel={setChannel} currentChannelList={channelList}
                    setChannelList={setChannelList}/>
                <UserScreen localStream={localStream} myCameraState={myCameraState} streams={peerStreamList}/>
                <ChatScreen channelName={channelName} id={id} name={username}/>
            </div>
            :
            <div>
                Loading...
            </div>
    );
}

export default Home;
