import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";
import ChatScreen from "./ChatScreen";
import {set} from 'react-hook-form';
import axios from 'axios';

function getChannelList() {
    return axios.get("https://localhost/channel");
}

const cameraListDummy = [{isCameraOn: false}, {isCameraOn: true}]

function Home() {
    const {username} = useParams();
    const [id, setId] = useState(1);
    const [channelName, setChannelName] = useState("");
    const [channelList, setChannelList] = useState([])
    const [myCameraState, setMyCameraState] = useState(false);
    const [myMikeState, setMyMikeState] = useState(false);
    let peers = {};
    const serverConnection = useRef(null);
    const [peerConnectionConfig, setPeerConfig] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const yourConn = useRef(null);
    
    useEffect(() => {
        setPeerConfig({
            'iceServers': [
                {'urls': 'stun:stun.stunprotocol.org:3478'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        });
        serverConnection.current = new WebSocket("wss://127.0.0.1/signal");
        serverConnection.current.onopen = async () => {
            const yourConnection = await new RTCPeerConnection(peerConnectionConfig)

            yourConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    send({
                        type: "ice",
                        from: username,
                        candidate: event.candidate
                    });
                }
            };
            yourConn.current = yourConnection;
            await joinChannel(1);
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
        
        // remoteVideo.current.srcObject = event.streams[0];
    }
    const createPeerConnection = () => {
        const pc = new RTCPeerConnection(peerConnectionConfig);
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                send({
                    type: "ice",
                    from: username,
                    candidate: event.candidate
                });
            }
        };
    }
    const getUserMediaSuccess = (stream) => {
        setLocalStream(stream);
        yourConn.current.ontrack = getRemoteStream;
        yourConn.current.addStream(stream);
    }

    const send = (message) => {
        serverConnection.current.send(JSON.stringify(message))
    }

    const handleAnswer = (answer) => {
        yourConn.current.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: answer.sdp
        }))
    }

    const handleCandidate = (candidate) => {
        yourConn.current.addIceCandidate(new RTCIceCandidate(candidate))
    }

    const handleMessageFromServer = (message) => {
        let data = JSON.parse(message.data)
        switch (data.type) {
            case "offer":
                console.log("====offer====")
                handleOffer(data)
                break;
            case "ice":
                console.log("====ice====")
                handleCandidate(data.candidate)
                break;
            case "answer":
                console.log("====answer====")
                handleAnswer(data)
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
        yourConn.current.createOffer((offer) => {
            console.log("offer", offer)
            send({
                type: "offer",
                from: username,
                data: id,
                candidate: "",
                sdp: offer.sdp
            })

            yourConn.current.setLocalDescription(offer)
        }, error => {
            console.error("offer ", error)
        })
    }

    const leaveChannel = () => {
        send({
            type: "leave",
            from: username,
            data: id
        })
    }

    const handleOffer = (offer) => {
        
        yourConn.current.setRemoteDescription(new RTCSessionDescription(offer))

        yourConn.current.createAnswer((answer) => {
            yourConn.current.setLocalDescription(answer)

            send({
                type: "answer",
                from: username,
                data: offer.data,
                candidate: "",
                sdp: answer.sdp
            })
        }, (error) => {
            alert("answer error")
        })
    }

    //leave channel
    const setChannel = (id) => {
        leaveChannel();
        joinChannel(id);
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
