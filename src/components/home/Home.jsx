import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";
import ChatScreen from "./ChatScreen";

function Home() {
    const {username} = useParams();
    const [cameraCount, setCameraCount] = useState(0); // 카메라 개수 상태
    const [channelName, chanName] = useState(""); // 카메라 개수 상태
    const [myCameraState, setMyCameraState] = useState(false);
    const [myMikeState, setmyMikeState] = useState(false);
    const [id, setId] = useState(1);
    const [channelList, setChannelList] = useState([])

    const serverConnection = useRef(null);
    const [connectedUser, setConnectedUser] = useState(null);
    const [peerConnectionConfig, setPeerConfig] = useState(null);


    useEffect(() => {
        setPeerConfig({
            'iceServers': [
                {'urls': 'stun:stun.stunprotocol.org:3478'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        });

        serverConnection.current = new WebSocket("https://127.0.0.1/signal");
        serverConnection.current.onopen = () => {
            console.log("Server connected...");
            joinChannel(1);
        }
        serverConnection.current.onmessage = handleMessageFromServer;

        return () => {
            if (serverConnection.current) {
                serverConnection.current.close();
            }
        };
    }, []);

    const send = (message) => {
        if (connectedUser) {
            message.name = connectedUser;
        }
        console.log("message to server:", message);
        serverConnection.current.send(JSON.stringify(message))
    }

    const handleMessageFromServer = (message) => {
        let data = JSON.parse(message.data)

        console.log(data.type)
        switch (data.type) {
            case "offer":
                console.log("====offer====")
                // handleOffer(data.offer, data.name)
                break;
            case "ice":
                console.log("====ice====")
                // handleIce
                break;
            case "state":
                setChannelList(JSON.parse(data.data).sort((a, b) => a.id - b.id))
                console.log(channelList)
                break;
            default:
                break;
        }
    }

    const joinChannel = (id) => {
        send({
            type: "join",
            from: username,
            data: id,
            candidate: "",
            sdp: "",
        })
    }

    const leaveChannel = () => {
        send({
            type: "leave",
            from: username,
            data: id
        })
    }

    const onCamera = () => {
        setMyCameraState(true)
    };
    const offCamera = () => {
        setMyCameraState(false)
    };
    const onMike = () => {
        setmyMikeState(true)
    }
    const offMike = () => {
        setmyMikeState(false)
    }

    const setChannel = (id) => {
        leaveChannel();
        joinChannel(id);
        setId(id);
    }

    return (
        <div className="home">
            <Sidebar username={username} cameraCount={cameraCount} onCamera={onCamera} offCamera={offCamera}
                     onMike={onMike} offMike={offMike} myMikeState={myMikeState} myCameraState={myCameraState}
                     setChannelName={chanName} setId={setChannel} channelList={channelList}
                     setChannelList={setChannelList}/>
            <UserScreen cameraCount={cameraCount} myCameraState={myCameraState}/>
            {/*<ChatScreen channelName={channelName} id={id} name={username}/>*/}
        </div>
    );
}

export default Home;
