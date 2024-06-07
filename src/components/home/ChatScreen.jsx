import React from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";

function ChatScreen({channelName, id, name, ...props}) {
    return (
        <div className="chat-screen">
            <ChatHeader channelName={channelName}/>
            <ChatBody channelName = {channelName} id={id} name={name}/>
        </div>
    );
}

export default ChatScreen;