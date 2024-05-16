import React from 'react';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

function ChatHeader() {
    return (
        <div className="chat-header">
            <div className="left">
                <ChatBubbleIcon style={{ marginRight: "8px" }}/>
                <h4 style={{ marginLeft: "8px" }}>일반</h4>
            </div>
        </div>
    );
}

export default ChatHeader;