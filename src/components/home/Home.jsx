import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatScreen from "./ChatScreen";
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";

function Home() {
    const {username} = useParams();
    const [cameraCount, setCameraCount] = useState(0); // 카메라 개수 상태
    const [channelName, chanName] = useState(""); // 카메라 개수 상태
    const [myCameraState, setMyCameraState] = useState(false);
    const [myMikeState, setmyMikeState] = useState(false);
    const [id, setId] = useState(1);
    const [channelList, setChannelList] = useState([])
    
    const remoteVideos = useRef({});
    
    const serverConnection = useRef(null);
    const [connectedUser, setConnectedUser] = useState(null);
    const [peerConnectionConfig, setPeerConfig] = useState(null);
    const firstConn = useRef(null);
    const yourConn = useRef(null);
    const remoteVideo = useRef(null);

    const localStream = useRef(null);
    const peers = useRef({});

    useEffect(() => {
        setPeerConfig({
            'iceServers': [
                {'urls': 'stun:stun.stunprotocol.org:3478'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        });
        serverConnection.current = new WebSocket("wss://127.0.0.1/signal");
        serverConnection.current.onopen = async () => {
            console.log("Server connected...");
        }
        serverConnection.current.onmessage = handleMessageFromServer;
        
        let constraints = {
            video: true,
            audio: true
        }
        

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
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
        //TODO: 상대방의 비디오를 받아와서 화면에 띄워주는 함수
        setCameraCount(1);
        // peers[sid] = event.streams[0];
    }

    const createPeerConnection = (peerName) => {
        const pc = new RTCPeerConnection(peerConnectionConfig);
        pc.onicecandidate = onIceCandidate;
        pc.ontrack = (event) => {
            peers.current[peerName].remoteStream = event.streams[0];
        };
        pc.addStream(localStream.current);

        return pc;
    }

    const onIceCandidate = (event) => {
        if (event.candidate) {
            send({
                type: "ice",
                from: username,
                candidate: event.candidate
            });
        }
    };

    const getUserMediaSuccess = (stream) => {
        localStream.current = stream;
    }

    const send = (message) => {
        serverConnection.current.send(JSON.stringify(message))
    }

    const sendJoin = (channelId) => {
        send({
            type: "join",
            from: username,
            data: channelId,
            candidate: "",
            sdp: "",
        })
    }

    const sendLeave = () => {
        send({
            type: "leave",
            from: username,
            data: id
        })
    }

    const onAddStream = (event) => {
        const newRemoteStreamElem = document.createElement('video');
        newRemoteStreamElem.autoplay = true;
        newRemoteStreamElem.srcObject = event.stream;
        remoteVideos.current.push(newRemoteStreamElem);
    }

    const handleJoin = (message) => {
        if (message.data === '-1') return;
        // TODO: 기존의 peer들을 모두 정리하는 코드 필요함
        peers.current = {};

        const peerNames = message.other.readyList;
        peerNames.forEach((peerName) => {
            const pc = createPeerConnection(peerName);
            peers.current[peerName] = {
                connection: pc,
                remoteStream: null,
                streamType: "voice" // TODO: streamType은 어떻게 받아올지 확인 후 변경
            }

            pc.createOffer((offer) => {
                pc.setLocalDescription(offer);
                send({
                    type: "offer",
                    from: username,
                    data: message.data,
                    candidate: "",
                    sdp: offer.sdp,
                    other: "",
                    to: peerName
                });
            }, error => {
                console.error("create offer error", error)
            });
        });
    }

    const handleOffer = (message) => {
        const pc = createPeerConnection(message.from);

        if (message.from in peers.current) {
            // TODO: 이미 연결된 상대방이 offer를 보낸 경우에는 기존의 연결을 먼저 끊는다.   
        }
        
        peers.current[message.from] = {
            connection: pc,
            remoteStream: null,
            streamType: "voice" // TODO: streamType은 어떻게 받아올지 확인 후 변경
        }

        pc.setRemoteDescription(new RTCSessionDescription(message))
        pc.createAnswer((answer) => {
            pc.setLocalDescription(answer)

            send({
                type: "answer",
                from: username,
                data: message.data,
                candidate: "",
                sdp: answer.sdp,
                other: "", // TODO: other가 어떤 type인지 확인 후 변경
                to: message.from // TODO: answer에도 to 보내줘야할 필요가 있는가?
            })
        }, (error) => {
            alert("create answer error")
        })
    }

    const handleAnswer = (message) => {
        const connection = peers.current[message.from].connection;
        connection.setRemoteDescription(new RTCSessionDescription(message))
    }

    const handleCandidate = (message) => {
        const connection = peers.current[message.from].connection;
        connection.addIceCandidate(new RTCIceCandidate(message))
    }

    const handleLeave = (message) => {
        const connection = peers.current[message.from].connection;
        // TODO: clean up connection
        peers.current[message.from] = undefined;
    }

    const handleState = (message) => {
        setChannelList(JSON.parse(message.data).sort((a, b) => a.id - b.id))
    }

    const handleMessageFromServer = (message) => {
        let data = JSON.parse(message.data)
        switch (data.type) {
            case "offer":
                handleOffer(data);
                break;
            case "ice":
                handleCandidate(data)
                break;
            case "answer":
                handleAnswer(data)
                break;
            case "state":
                handleState(data)
                break;
            case "join":
                handleJoin(data)
                break;
            default:
                break;
        }
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
        sendLeave();
        sendJoin(id);
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
            <UserScreen cameraCount={cameraCount} myCameraState={myCameraState} remoteVideo={remoteVideo}/>
            <ChatScreen channelName={channelName} id={id} name={username}/>
        </div>
    );
}

export default Home;
