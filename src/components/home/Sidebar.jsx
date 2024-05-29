import React, { useState } from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CameraOnIcon from "@mui/icons-material/Videocam";
import CameraOffIcon from "@mui/icons-material/VideocamOff";
import MicOnIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ChannelList from "./ChannelList";
import Dialog from "./AddChannelDialog";
import UserScreen from './UserScreen';
import Home from './Home';
import UserCamera from './UserCamera';
import UserVoice from './UserVoice';

function Sidebar(props) {
    const [showDialog, setShowDialog] = useState(false);

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    props.setChannelName("Test1");
    
    return (
        <div className="col-md-2 sidebar" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
            <div className="top">
                <h3>{props.username}</h3>
                <ExpandMoreIcon />
            </div>

            <div className="channels">
                <div className="channels-header">
                    <div className="header">
                        <ExpandMoreIcon />
                        <h5>음성 체널</h5>
                    </div>
                    <AddIcon onClick={handleOpenDialog} />

                    {showDialog && <Dialog onClose={handleCloseDialog} />}
                </div>
                <ChannelList channelName= "Test1" users={[{index: 1, name: "temp"}/*, {index: 2, name: "temp1"}*/]} username={props.username} />
            </div>

            <div className="profile-icons">
                <div className="icon">                    
                    {(props.myMikeState) ?
                    <MicOnIcon onClick={props.offMike} /> :
                    <MicOffIcon onClick={props.onMike} />}
                    <UserVoice micState ={props.myMikeState} />
                </div>
                <div className="icon">
                    {(props.myCameraState) ?
                    <CameraOnIcon onClick={props.offCamera} /> :
                    <CameraOffIcon onClick={props.onCamera} />}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
