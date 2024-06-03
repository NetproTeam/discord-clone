import React from "react";

function ChatMessage(props) {
    return (
        <div>
            <div className="message-title">
                <h4>{props.name}</h4>
                <h4>{props.sendAt}</h4>
            </div>
            <p>{props.content}</p>
        </div>
    )
}

export default ChatMessage;