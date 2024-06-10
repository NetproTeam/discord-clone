import React, {useState, useEffect} from "react";
import ModeIcon from '@mui/icons-material/Mode';
import SoundIcon from "@mui/icons-material/VolumeUp"
import {Delete, Mode} from "@mui/icons-material";
import ChannelEdit from "./ChannelEdit";
import ChannelDelete from "./ChannelDelete";

function ListHeader({setChannelFromCurrentId, originChannelName, channelId, onReset, createdBy,username}) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [channelName, setChannelName] = useState(originChannelName);

    const handleUpdateChannelName = (newName) => {
        setChannelName(newName);
        setShowEditDialog(false);
        onReset();
    };

    const handleCloseDeleteDialog = () => {
        onReset();
        setShowDeleteDialog(false);
    };

    return (
        <div className="list-header" style={{width:"100%"}}>
            <div className="list-joinBtn" style={{width:"100%"}}>
                <button onClick={setChannelFromCurrentId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    width: '100%',
                }}>
                    <SoundIcon style={{color: "white"}}/>
                    <h4 style={{marginLeft: '10px', display: "inline-block", color: "white"}}>
                        {channelName}</h4>
                </button>
            </div>
            <div className="list-editBtn">
                {channelId === 1 ? <></> :
                    <Mode onClick={() => setShowEditDialog(true)} style={{color: "white", justifyContent: 'space-between'}}/>}
                {showEditDialog && <ChannelEdit onClose={() => setShowEditDialog(false)} initialChannelName={channelName}
                                                onSubmit={handleUpdateChannelName} channelId={channelId} /> }
            </div>
            <div className="list-deleteBtn">
                {channelId === 1 || createdBy !== username? <></> : <Delete onClick={() => setShowDeleteDialog(true)} style={{color: "white"}} createdBy={createdBy}/>}
                {showDeleteDialog &&
                    <ChannelDelete onClose={handleCloseDeleteDialog} channelId={channelId} createdBy={createdBy} username={username}/>}
            </div>
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

function ChannelList({channelName, channelId, client, onReset, setChannel,createdBy,username, ...props}) {
    return (
        <div className="channel-detail">
            <ListHeader originChannelName={channelName} onReset={onReset} channelId={channelId}
                        setChannelFromCurrentId={()=>{setChannel(channelId)}} createdBy={createdBy} username={username}/>
            {client && client.map(user => {
                    return <User username={user} key={user}/>
                }
            )}
        </div>
    );
}

export default ChannelList;