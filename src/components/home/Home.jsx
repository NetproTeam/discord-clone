import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";
import ChatScreen from "./ChatScreen";

function Home() {
    const {username} = useParams();
    const [cameraCount, setCameraCount] = useState(0); // 카메라 개수 상태
    const [channelName, chanName] = useState(""); // 카메라 개수 상태
    const [myCameraState, setMyCameraState] = useState(false);
    const onCamera = () => {
        setMyCameraState(true)
    };
    const offCamera = () => {
        setMyCameraState(false)
    };

    return (
        <div className="home">
            <Sidebar username={username} cameraCount={cameraCount} onCamera={onCamera} offCamera = {offCamera} myCameraState={myCameraState} setChannelName={chanName}/>
            <UserScreen cameraCount={cameraCount} myCameraState={myCameraState}/>
            <ChatScreen channelName = {channelName} />
        </div>
    );
}

export default Home;
