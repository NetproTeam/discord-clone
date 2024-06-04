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
    const [localStream, setLocalStream] = useState(null);
    const yourConn = useRef(null);
    const [remoteVideo, setRemoteVideo] = useState(null);

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

        let constraints = {
            video: true,
            audio: true
        }
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler)
        } else {
            alert("브라우저가 미디어 API를 지원하지 않음")
        }

        return () => {
            if (serverConnection.current) {
                serverConnection.current.close();
            }
        };
    }, []);

    const getRemoteStream = (event) => {
        remoteVideo.srcObject = event.stream[0]
    }

    const getUserMediaSuccess = (stream) => {
        setLocalStream(stream);
        const yourConnection = new RTCPeerConnection(peerConnectionConfig)

        yourConnection.onicecandidate = (event) => {
            console.log("on icecandidate get user success:", event.candidate);
            if (event.candidate) {
                send({
                    type: "candidate",
                    candidate: event.candidate
                });
            }
        };
        yourConnection.ontrack = getRemoteStream;
        yourConnection.addStream(stream);
        yourConn.current = yourConnection
    }

    const send = (message) => {
        if (connectedUser) {
            message.name = connectedUser;
        }
        console.log("message to server:", message);
        serverConnection.current.send(JSON.stringify(message))
    }

    const handleAnswer = (answer) => {
        console.log("answer:", answer)
        yourConn.current.setRemoteDescription(new RTCSessionDescription(answer))
    }

    const handleCandidate = (candidate) => {
        yourConn.current.addIceCandidate(new RTCIceCandidate(candidate))
    }

    const handleMessageFromServer = (message) => {
        let data = JSON.parse(message.data)

        console.log(data.type)
        switch (data.type) {
            case "offer":
                console.log("====offer====")
                console.log(data)
                handleOffer(data.data, data.name)
                break;
            case "ice":
                console.log("====ice====")
                handleCandidate(data.data)
                break;
            case "answer":
                console.log("====answer====")
                handleAnswer(data.data)
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
        if (yourConn.current) {
            yourConn.current.createOffer((offer) => {
                send({
                    type: "offer",
                    from: username,
                    data: id,
                    candidate: "",
                    sdp: offer.sdp
                })
            }, error => {
                console.error("offer ", error)
            })
        }

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

    const handleOffer = (offer, name) => {
        console.log(yourConn.current);
        yourConn.current.setRemoteDescription(new RTCSessionDescription({offer: offer}))

        yourConn.current.createAnswer((answer) => {
            yourConn.current.setLocalDescription(answer)

            send({
                type: "answer",
                from: username,
                data: id,
                candidate: "",
                sdp: answer.sdp
            })
        }, (error) => {
            alert("answer error")
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

    const errorHandler = (error) => {
        console.error(error)
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
