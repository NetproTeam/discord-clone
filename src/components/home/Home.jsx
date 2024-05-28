import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";
import ChatScreen from "./ChatScreen";

function Home() {
    const {username} = useParams();
    const [cameraCount, setCameraCount] = useState(0); // 카메라 개수 상태
    const onCamera = () => {
        setCameraCount(prevCount => prevCount + 1); // 카메라 개수 증가
    };
    const offCamera = () => {
        setCameraCount(prevCount => prevCount - 1); // 카메라 개수 감소
    };

    return (
        <div className="home">
            <Sidebar username={username} cameraCount={cameraCount} onCamera={onCamera} offCamera = {offCamera}/>
            <UserScreen cameraCount={cameraCount} />
            <ChatScreen />
        </div>
    );
}

export default Home;
