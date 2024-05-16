import React from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";

function ChatScreen() {
    return (
        <div className="chat-screen">
            <ChatHeader />
            <ChatBody />
        </div>
    );
}

export default ChatScreen;