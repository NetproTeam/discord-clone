import React from "react";
import SoundIcon from "@mui/icons-material/VolumeUp"

function ListHeader(props) {
    return (
        <div className="list-header">
            <SoundIcon/>
            <h4>{props.channelName}</h4>
        </div>
    );
}

function User(props) {
    return (
        <div className="users">
            <h5>{props.username}</h5>
        </div>
    );
}

function ChannelList(props) {
    return (
        <div className="channel-detail">
            <ListHeader channelName={props.channelName}/>
            <User username={props.username}/>
        </div>
    );
}

export default ChannelList;