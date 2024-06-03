import React, {useState, useEffect} from "react";
import ModeIcon from '@mui/icons-material/Mode';
import SoundIcon from "@mui/icons-material/VolumeUp"
import { colors } from "@mui/material";
import { Delete, Mode } from "@mui/icons-material";
import ChannelEdit from "./ChannelEdit";
import ChannelDelete from "./ChannelDelete";
import axios from "axios";

function ListHeader({addUser, channelName, channelId, onReset}) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [chanName, setChannelName] = useState(channelName);
 
    const handleOpenDialog = () => {
        setShowEditDialog(true);
    };

    const handleCloseDialog = () => {
        onReset();
        setShowEditDialog(false);
    };

    const handleUpdateChannelName = (newName) => {
        onReset();
        setChannelName(newName);
        setShowEditDialog(false);
    };

    const handleOpenDeleteDialog = () => {
        setShowDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        onReset();
        setShowDeleteDialog(false);
    };

    return (
        <div className="list-header">
            <div className="list-joinBtn">
            <button onClick={addUser} style={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer' }}>
                <SoundIcon style={{color: "white"}} />
                <h4 style={{ marginLeft: '10px',display: "inline-block", color: "white" }}>
                    {chanName}</h4>
            </button>
            </div>
            <div className="list-editBtn">
            {channelId === 1 ? <></> : <Mode onClick={handleOpenDialog} style={{ color: "white", justifyContent: 'space-between' }} />}
            {showEditDialog && <ChannelEdit onClose={handleCloseDialog} initialChannelName={chanName} onSubmit={handleUpdateChannelName}  channelId = {channelId} name = {chanName}/>}
            </div>
            <div className="list-deleteBtn">
            {channelId === 1 ? <></> : <Delete onClick={handleOpenDeleteDialog} style={{ color: "white" }} />}
            {showDeleteDialog && <ChannelDelete onClose={handleCloseDeleteDialog} channelId = {channelId} name = {chanName}/>}
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

function ChannelList(props) {
    const [showUser, setShowUser] = useState(false);
    const [channelId, setChannelId] = useState(props.channelId);

    const addUser = () => {
        setShowUser(!showUser);
    };
    return (
        <div className="channel-detail">
            <ListHeader channelName={props.channelName} onReset={props.onReset} channelId={channelId}  addUser={addUser}/>
            
            {/*{props.users.map( user =>*/}
            {/*    <User key={user.index} username={user.name}/>*/}
            {/*)}*/}
                
        </div>
    );
}

export default ChannelList;