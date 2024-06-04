import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserScreen from "./UserScreen";
import ChatScreen from "./ChatScreen";
import { set } from 'react-hook-form';

function Home() {
    const {username} = useParams();
    const [cameraCount, setCameraCount] = useState(0); // 카메라 개수 상태
    const [channelName, chanName] = useState(""); // 카메라 개수 상태
    const [myCameraState, setMyCameraState] = useState(false);
    const [myMikeState, setmyMikeState] = useState(false);
    const [id, setId] = useState(1);
    const [channelList, setChannelList] = useState([])
    let peers = {};
    let pendingCandidates = {};
    const remoteVideos = useRef({});
    const serverConnection = useRef(null);
    const [connectedUser, setConnectedUser] = useState(null);
    const [peerConnectionConfig, setPeerConfig] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const firstConn = useRef(null);
    const yourConn = useRef(null);
    const remoteVideo = useRef(null);

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
            // const yourConnection = await new RTCPeerConnection(peerConnectionConfig)

            // yourConnection.onicecandidate = (event) => {
            //     console.log("on icecandidate get user success:", event.candidate);
            //     if (event.candidate) {
            //         send({
            //             type: "ice",
            //             from: username,
            //             candidate: event.candidate
            //         });
            //     }
            // };
            // yourConn.current = yourConnection;
            await joinChannel(1);
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
    const createPeerConnection = (sid) => {
        const pc = new RTCPeerConnection(peerConnectionConfig);
        pc.onicecandidate = onIceCandidate;
        pc.ontrack = (event) => {
            console.log("ontrack", event)
            setCameraCount(1);
            remoteVideos.current[sid].srcObject = event.streams[0];
        };
        // pc.onaddstream = onAddStream();
        pc.addStream(localStream);
        return pc;
    }

    const onIceCandidate = (event) => {
        console.log("on icecandidate get user success:", event.candidate);
        if (event.candidate) {
            send({
                type: "ice",
                from: username,
                candidate: event.candidate
            });
        }
    };

    const addPendingCandidates = (sid) => {
        if (sid in pendingCandidates) {
            pendingCandidates[sid].forEach(candidate => {
                peers[sid].addIceCandidate(new RTCIceCandidate(candidate))
            });
        }
    }

    const getUserMediaSuccess = (stream) => {
        setLocalStream(stream);
        // yourConn.current.ontrack = getRemoteStream;
        // yourConn.current.addStream(stream);
    }

    const send = (message) => {
        console.log("message to server:", message);
        serverConnection.current.send(JSON.stringify(message))
    }

    const sendOffer = (client, id) => {
        peers[client].createOffer((offer) => {
            console.log("offer", offer)
            send({
                type: "offer",
                from: username,
                data: id,
                candidate: "",
                sdp: offer.sdp,
                other: {"to" : client}
            })

            peers[client].setLocalDescription(offer)
        }, error => {
            console.error("offer ", error)
        })
    }

    const sendAnswer = (client, id) => {
        console.log("sendAnswer")
        peers[client].createAnswer((answer) => {
            console.log("answer", answer)
            send({
                type: "answer",
                from: username,
                data: id,
                candidate: "",
                sdp: answer.sdp
            })

            peers[client].setLocalDescription(answer)
        }, error => {
            console.error("answer ", error)
        })
    }

    const onAddStream = (event) => {
        const newRemoteStreamElem = document.createElement('video');
        newRemoteStreamElem.autoplay = true;
        newRemoteStreamElem.srcObject = event.stream;
        remoteVideos.current.push(newRemoteStreamElem);
    }

    const handleAnswer = (answer) => {
        console.log("answer:", answer)
        console.log("yourConn:", yourConn.current)
        yourConn.current.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: answer.sdp
        }))
    }

    const handleCandidate = (candidate) => {
        console.log("candidate:", candidate)
        yourConn.current.addIceCandidate(new RTCIceCandidate(candidate))
    }

    const handleMessageFromServer = (message) => {
        let data = JSON.parse(message.data)
        console.log(message)
        switch (data.type) {
            case "offer":
                console.log("====offer====")
                // handleOffer(data)
                peers[data.from] = createPeerConnection(data.from);
                peers[data.from].setRemoteDescription(new RTCSessionDescription(data));
                sendAnswer(data.from);
                addPendingCandidates(data.from);
                break;

            case "ice":
                console.log("====ice====")
                // handleCandidate(data)
                if (data.from in peers) {
                    peers[data.from].addIceCandidate(new RTCIceCandidate(data.candidate));
                } else {
                    if (!(data.from in pendingCandidates)) {
                        pendingCandidates[data.from] = [];
                    }
                    pendingCandidates[data.from].push(data.candidate)
                }
                break;
            case "answer":
                console.log("====answer====")
                // handleAnswer(data)
                peers[data.client].setRemoteDescription(new RTCSessionDescription(data));
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
        peers = {};
        send({
            type: "join",
            from: username,
            data: id,
            candidate: "",
            sdp: "",
        })
        const yourConnection = new RTCPeerConnection(peerConnectionConfig)

        yourConnection.onicecandidate = onIceCandidate;
        yourConn.current = yourConnection;
        
        channelList.forEach((channel) => {
            if (channel.id === id) {
                console.log(channel.clients)
                channel.clients.forEach((client) => {
                    if (client !== username) {
                        peers[client] = createPeerConnection(client);
                        sendOffer(client, id);
                        addPendingCandidates(client);
                    }
                })
            }
        })
        // yourConn.current.createOffer((offer) => {
        //     console.log("offer", offer)
        //     send({
        //         type: "offer",
        //         from: username,
        //         data: id,
        //         candidate: "",
        //         sdp: offer.sdp
        //     })

        //     yourConn.current.setLocalDescription(offer)
        // }, error => {
        //     console.error("offer ", error)
        // })
    }

    const leaveChannel = () => {
        send({
            type: "leave",
            from: username,
            data: id
        })
    }

    const handleOffer = (offer) => {
        console.log(offer)

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
            <UserScreen cameraCount={cameraCount} myCameraState={myCameraState} remoteVideo={remoteVideo}/>
            <ChatScreen channelName={channelName} id={id} name={username}/>
        </div>
    );
}

export default Home;
