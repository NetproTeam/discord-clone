import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatScreen from "./ChatScreen";
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";

const cameraListDummy = [{isCameraOn: false}, {isCameraOn: true}]

function Home() {
    const {username} = useParams();
    const [id, setId] = useState(1);
    const [channelName, setChannelName] = useState("");
    const [channelList, setChannelList] = useState([])
    const [myCameraState, setMyCameraState] = useState(false);
    const [myMikeState, setMyMikeState] = useState(false);

    
    const remoteVideos = useRef({});
    

    const serverConnection = useRef(null);
    const [peerConnectionConfig, setPeerConfig] = useState(null);
    

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

        return () => {
            if (serverConnection.current) {
                serverConnection.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if(!(myCameraState  && myMikeState)) {
            return ;
        }
        let constraints = {
            video: myCameraState,
            audio: myMikeState,
        }

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(getUserMediaSuccess).catch(errorHandler);
        } else {
            alert("브라우저가 미디어 API를 지원하지 않음")
        }
    }, [myCameraState, myMikeState]);

    const getRemoteStream = (event) => {
        //TODO: 상대방의 비디오를 받아와서 화면에 띄워주는 함수

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

    const setChannel = (id) => {
        sendLeave();
        sendJoin(id);
        setId(id);
        setChannelName(channelList.map(channel => {
            if (channel.id === id) {
                return channel.name
            }
        }))
    }

    const errorHandler = (error) => {
        console.error(error)
    }

    return (
        <div className="home">
            <Sidebar username={username} 
                setMyMikeState={() => setMyMikeState(!myMikeState)} myMikeState={myMikeState}
                setMyCameraState={() => setMyCameraState(!myCameraState)} myCameraState={myCameraState}
                setChannelName={setChannelName} setChannel={setChannel} currentChannelList={channelList}
                setChannelList={setChannelList}/>
            <UserScreen myCameraState={myCameraState}  myMikeState = {myMikeState} cameraList={cameraListDummy}/>
            <ChatScreen channelName={channelName} id={id} name={username}/>
        </div>
    );
}

export default Home;
