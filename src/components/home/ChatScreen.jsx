import React from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";

function ChatScreen(props) {
    return (
        <div className="chat-screen">
            <ChatHeader />
            <ChatBody channelName = {props.channelName} id={props.id} name={props.name}/>
        </div>
    );
}

export default ChatScreen;