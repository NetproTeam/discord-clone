import React from "react";
import {useParams} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";
import ChatScreen from "./ChatScreen";

function Home() {
    const {username} = useParams();

    return (
        <div className="home">
            <Sidebar username={username}/>
            <UserScreen />
            <ChatScreen />
        </div>
    );
}

export default Home;
