import React, {useEffect, useRef, useState} from 'react';


function useWebRtc({username, id, myCameraState, myMikeState, setChannelList}) {
    const peerStreamList = useRef([]);
    const [ready, setReady] = useState(false);
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
            setReady(false);
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

    const createPeerConnection = (peerName) => {
        const pc = new RTCPeerConnection(peerConnectionConfig);
        pc.onicecandidate = onIceCandidate;
        pc.ontrack = (event) => {
            // console.log("ontrack", event)
            peers.current[peerName].remoteStream = event.streams[0];
            for (let i = 0; i < peerStreamList.current.length; i++) {
                if (peerStreamList.current[i].peerName === peerName) {
                    peerStreamList.current[i].stream = event.streams[0];
                    return;
                }
            }
            peerStreamList.current.push({
                peerName: peerName,
                stream: event.streams[0]
            });
        };
        localStream.current.getTracks().forEach(track => {
            pc.addTrack(track, localStream.current);
        });
        return pc;
    };

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
        setReady(true);
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

    const leaveChannel = () => {
        send({
            type: "leave",
            from: username,
            data: id
        })
        for (let peer in peers.current) {
            if (peers.current[peer] !== undefined) {
                peers.current[peer].connection.close();
                peers.current[peer] = undefined;   
            }
        }
        console.log("leave channel: ", peers.current)
    }

    const handleJoin = (message) => {
        if (message.data === '-1') return;
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
                to: message.from
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
        if (peers.current[message.from] === undefined) return;
        const connection = peers.current[message.from].connection;
        connection.close();
        peers.current[message.from] = undefined;
        console.log("receive leave: ", peers.current)
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
            case "leave":
                handleLeave(data)
                break;
            default:
                break;
        }
    }
    
    const errorHandler = (error) => {
        console.error(error)
    }

    return [
        peerStreamList.current,
        sendJoin,
        leaveChannel,
        peers,
        ready,
        localStream.current
    ];
}

export default useWebRtc;