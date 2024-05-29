import React, {useState} from "react";
import SoundIcon from "@mui/icons-material/VolumeUp"
import { colors } from "@mui/material";

function ListHeader(props) {

    return (
        <div className="list-header">
            <button onClick={props.addUser} style={{ display: 'flex', alignItems: 'center', padding: '1px', border: 'none', background: 'none', cursor: 'pointer' }}>
                <SoundIcon style={{color: "white"}} />
                <h4 style={{ marginLeft: '10px', color: "white" }}>
                    {props.channelName}</h4>
            </button>
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
    const [showUser, setShowUser] = useState(false);

    const addUser = () => {
        setShowUser(!showUser);
    };
    return (
        <div className="channel-detail">
            <ListHeader channelName={props.channelName} addUser={addUser}/>
            
            {props.users.map( user =>
                <User key={user.index} username={user.name}/>
            )}
                
        </div>
    );
}

export default ChannelList;