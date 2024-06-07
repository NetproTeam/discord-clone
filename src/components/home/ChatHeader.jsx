import React from 'react';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';


function ChatHeader({channelName, ...props}) {
    return (
        <div className="chat-header">
            <div className="left">
                <ChatBubbleIcon style={{ marginRight: "8px" }}/>
                <h4 style={{ marginLeft: "8px" }}>{channelName}</h4>
            </div>
        </div>
    );
}

export default ChatHeader;