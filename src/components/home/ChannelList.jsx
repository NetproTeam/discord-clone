import React, {useState} from "react";
import SoundIcon from "@mui/icons-material/VolumeUp"
import { Delete, Mode } from "@mui/icons-material";
import ChannelEdit from "./ChannelEdit";
import ChannelDelete from "./ChannelDelete";

function ListHeader({addUser, channelName, channelId, onReset}) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [chanName, setChannelName] = useState(channelName);

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
        console.log("chanlist "+channelId);
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
            {showEditDialog && <ChannelEdit onClose={handleCloseDialog} initialChannelName={chanName} onSubmit={handleUpdateChannelName} />}
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

    const addUser = () => {
        setShowUser(!showUser);
    };

    return (
        <div className="channel-detail" onClick={() => props.setChannel(props.channelName, props.channelId)}>
            <ListHeader channelName={props.channelName} onReset={props.onReset} channelId={props.channelId}  addUser={addUser}/>

            {/*{props.users.map( user =>*/}
            {/*    <User key={user.index} username={user.name}/>*/}
            {/*)}*/}

        </div>
    );
}

export default ChannelList;