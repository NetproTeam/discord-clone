import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";
import ChatScreen from "./ChatScreen";

var name;
var allUsers;
var localVideo;
var remoteVideo;
var serverConnection;
var localStream;
var yourConn;
var connectionState;
var connectedUser;

var peerConnectionConfig = {
    'iceServers': [
        {'urls': 'stun:stun.stunprotocol.org:3478'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
}

serverConnection = new WebSocket("https://127.0.0.1/signal");
serverConnection.onopen = function () {
    console.log("server on connect....")
}
serverConnection.onmessage = getMessageFromServer;

const enterChannel = () => {
    console.log("call button")

    var callToUsername = document.getElementById('callToUsernameInput').value

    if(callToUsername.length > 0) {
        connectedUser = callToUsername
        console.log("누구한테 전화 할건가용?", connectedUser)
        console.log("내 connection 확인:", yourConn.connectionState)
        console.log("내 signaling 확인:", yourConn.signalingState)

        yourConn.createOffer(function(offer){
            send({
                type:"offer",
                offer: offer
            })

            yourConn.setLocalDescription(offer)
        }, function (error){
            alert("offer 생성 error:" + error)
            console.log("offer 생성 error:", error)
        })

        document.getElementById('callNavigator').style.display = 'none'
    } else {
        alert("사용자 이름 없음")
    }
};

const leaveChannel = () => {
    send({
        type: "leave"
    });

    handleLeave();

    document.getElementById('callOngoing').style.display = 'none';
    document.getElementById('callInitiator').style.display = 'block';
};

function send(message){
    if (connectedUser) {
        message.name = connectedUser;
    }
    console.log("message to server:", message)
    serverConnection.send(JSON.stringify(message))
}

function getMessageFromServer(message) {
    console.log('get Message:', message)

    let data = JSON.parse(message.data)

    switch (data.type) {
        case "ice":
            console.log("====ice====")
            handleCandidate(data.candidate)
            break;
        case "offer":
            console.log("====offer====")
            break;
        case "join":
            console.log("====join====")
            break;
        case "leave":
            console.log("====leave====")
            break;
        default:
            break;

    }
}

function handleCandidate(candidate) {
    yourConn.addIceCandidate(new RTCIceCandidate(candidate))
}

function handleLeave() {
    connectedUser = null;
    remoteVideo.src = null;
    var connectionState = yourConn.connectionState;
    var signallingState = yourConn.signalingState;
    console.log('connection state before',connectionState)
    console.log('signalling state before',signallingState)
    yourConn.close();
    yourConn.onicecandidate = null;
    yourConn.onaddstream = null;
    var connectionState1 = yourConn.connectionState;
    var signallingState1 = yourConn.signalingState;
    console.log('connection state after',connectionState1)
    console.log('signalling state after',signallingState1)
};


function Home() {
    const {username} = useParams();
    const [cameraCount, setCameraCount] = useState(0); // 카메라 개수 상태
    const [channelName, chanName] = useState(""); // 카메라 개수 상태
    const [myCameraState, setMyCameraState] = useState(false);
    const [myMikeState, setmyMikeState] = useState(false);
    const [id, setId] = useState(1);

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

    return (
        <div className="home">
            <Sidebar username={username} cameraCount={cameraCount} onCamera={onCamera} offCamera={offCamera}
                     onMike={onMike} offMike={offMike} myMikeState={myMikeState} myCameraState={myCameraState}
                     setChannelName={chanName} setId={setId}/>
            <UserScreen cameraCount={cameraCount} myCameraState={myCameraState}/>
            <ChatScreen channelName={channelName} id={id} name={username}/>
        </div>
    );
}

export default Home;
