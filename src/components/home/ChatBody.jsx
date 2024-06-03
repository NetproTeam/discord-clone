import React, {useEffect, useState} from 'react';
import axios from "axios";

function sendMessage() {
    axios.get();
}

function ChatBody(props) {
    const [input, setInput] = useState('');

    useEffect(() => {

    }, [input]);

    return (
        <div className="chat-body">
            <div className="messages">

            </div>

            <div className="chat-input">
                <form onSubmit={e => {
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