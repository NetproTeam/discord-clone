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
            // await sendJoin(1); // TODO: 지워도 될듯
        }
        serverConnection.current.onmessage = handleMessageFromServer;
        
        let constraints = {
            video: true,
            audio: true
        }
        

        if (navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia supported.")
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
        // console.log("localStream")
        // console.log(localStream.current)
        pc.addStream(localStream.current);

        return pc;
    }

    // const createPeerConnection = (sid) => {
    //     const pc = new RTCPeerConnection(peerConnectionConfig);
    //     pc.onicecandidate = onIceCandidate;
    //     pc.ontrack = (event) => {
    //         console.log("ontrack", event)
    //         setCameraCount(1);
    //         remoteVideos.current[sid].srcObject = event.streams[0];
    //     };
    //     // pc.onaddstream = onAddStream();
    //     pc.addStream(localStream);
    //     return pc;
    // }

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

    const getUserMediaSuccess = (stream) => {
        console.log("getUserMediaSuccess")
        console.log(stream)
        localStream.current = stream;
        console.log(localStream.current)
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
        console.log("[handleJoin] Client", message.from, "is ready to join channel no.", message)
        console.log(message);

        if (message.data === '-1') return;
        // TODO: 기존의 peer들을 모두 정리하는 코드 필요함
        peers.current = {};

        const peerNames = message.other.readyList; // TODO: other에 정확히 어떻게 넘어오는지는 서버 확인 후 변경
        console.log("[handleJoin] Peer names are", peerNames)
        peerNames.forEach((peerName) => {
            console.log("[handleJoin] Client", message.from, "is creating connection with", peerName)
            const pc = createPeerConnection(peerName);
            peers.current[peerName] = {
                connection: pc,
                remoteStream: null,
                streamType: "voice" // TODO: streamType은 어떻게 받아올지 확인 후 변경
            }
            console.log(peers.current)

            pc.createOffer((offer) => {
                console.log("[handleJoin] Client", message.from, "is creating offer for", peerName)
                pc.setLocalDescription(offer);
                send({
                    type: "offer",
                    from: username,
                    data: message.data,
                    candidate: "",
                    sdp: offer.sdp,
                    other: "", // TODO: other가 어떤 type인지 확인 후 변경
                    to: peerName
                });
            }, error => {
                console.error("create offer error", error)
            });
        });
    }

    const handleOffer = (message) => {
        console.log("[handleOffer] Client got offer from", message.from)
        console.log(message);

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
        console.log("[handleAnswer] Client got answer from", message.from);
        console.log(message);
        
        const connection = peers.current[message.from].connection;
        console.log("[handleAnswer] Connection with Client ", message.from, " is")
        console.log(connection)
        
        connection.setRemoteDescription(new RTCSessionDescription(message))
    }

    const handleCandidate = (message) => {
        console.log("[handleCandidate] Client got candidate message from", message.from)
        console.log(message);

        const connection = peers.current[message.from].connection;
        console.log("[handleCandidate] Connection with Client ", message.from, " is")
        console.log(connection)
        
        connection.addIceCandidate(new RTCIceCandidate(message))
    }

    const handleLeave = (message) => {
        console.log("[handleLeave] Client", message.from, "left channel no.", message.data)
        console.log(message);

        const connection = peers.current[message.from].connection;
        // TODO: clean up connection
        peers.current[message.from] = undefined;
    }

    const handleState = (message) => {
        console.log("[handleState] Client got state message from server")
        console.log(message);
        setChannelList(JSON.parse(message.data).sort((a, b) => a.id - b.id))
        console.log(channelList)
    }

    const handleMessageFromServer = (message) => {
        let data = JSON.parse(message.data)
        console.log("[handleMessageFromServer] 이건 message, 실 사용은 message.data")
        console.log(message)
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
