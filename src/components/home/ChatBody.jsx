import React, {useEffect, useRef, useState} from 'react';
import * as StompJs from '@stomp/stompjs';
import ChatMessage from "./ChatMessage";
import SockJS from "sockjs-client";

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toTimeString().split(' ')[0];
}

function ChatBody(props) {
    const [input, setInput] = useState('');
    const client = useRef({});
    const serverUrl = "ws://localhost:8080/chatting"
    const [chatMessages, setChatMessages] = useState([]);
    useEffect(() => {
        connect();
        setChatMessages([]);
        return () => disconnect();
    }, [props.id]);

    const connect = () => {
        client.current = new StompJs.Client({
            brokerURL: serverUrl,
            webSocketFactory: () => new SockJS("http://localhost:8080/chatting"),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                subscribe();
                console.log("Chatting Connected");
            },
            onStompError: (frame) => {
                console.error(frame);
            },
        });

        client.current.activate();
    };

    const disconnect = () => {
        client.current.deactivate();
    };

    const subscribe = () => {
        client.current.subscribe(`/send/chat/${props.id}`, ({body}) => {
            setChatMessages((_chatMessages) => [..._chatMessages, JSON.parse(body)].sort((a, b) => b.sentAt.localeCompare(a.sentAt)));
        });
    };

    const publish = (message) => {
        if (!client.current.connected) {
            return;
        }

        client.current.publish({
            destination: `/chat/${props.id}`,
            body: JSON.stringify({
                senderUniqueName: props.name,
                content: message
            }),
        });

        setInput("");
    };

    return (
        <div className="chat-body">
            <div className="messages">
                {chatMessages.map((message) => {
                    return <ChatMessage name={message.senderUniqueName} content={message.content}
                                        sendAt={formatTime(message.sentAt)} key={message.sentAt}
                    />
                })}
            </div>

            <div className="chat-input">
                <form onSubmit={e => {
                    publish(input);
                    e.preventDefault();
                }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={props.channelName + "에 메시지 보내기"}/>
                </form>
            </div>
        </div>
    )
}

export default ChatBody;