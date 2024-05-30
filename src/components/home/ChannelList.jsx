import React, {useState} from "react";
import ModeIcon from '@mui/icons-material/Mode';
import SoundIcon from "@mui/icons-material/VolumeUp"
import { colors } from "@mui/material";
import { Delete, Mode } from "@mui/icons-material";
import ChannelEdit from "./ChannelEdit";
import ChannelDelete from "./ChannelDelete";

function ListHeader(props) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [channelName, setChannelName] = useState(props.channelName);

    const handleOpenDialog = () => {
        setShowEditDialog(true);
    };

    const handleCloseDialog = () => {
        setShowEditDialog(false);
    };

    const handleUpdateChannelName = (newName) => {
        setChannelName(newName);
        setShowEditDialog(false);
    };

    const handleOpenDeleteDialog = () => {
        setShowDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setShowDeleteDialog(false);
    };

    return (
        <div className="list-header">
            <div className="list-joinBtn">
            <button onClick={props.addUser} style={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer' }}>
                <SoundIcon style={{color: "white"}} />
                <h4 style={{ marginLeft: '10px',display: "inline-block", color: "white" }}>
                    {props.channelName}</h4>
            </button>
            </div>
            <div className="list-editBtn">
            <Mode onClick={handleOpenDialog} style={{ color: "white", justifyContent: 'space-between' }} />
            {showEditDialog && <ChannelEdit onClose={handleCloseDialog} initialChannelName={channelName} onSubmit={handleUpdateChannelName} />}
            </div>
            <div className="list-deleteBtn">
            <Delete onClick={handleOpenDeleteDialog} style={{ color: "white" }} />
            {showDeleteDialog && <ChannelDelete onClose={handleCloseDeleteDialog} />}
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