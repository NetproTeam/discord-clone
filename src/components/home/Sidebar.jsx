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
                <ChannelList channelName="Test1" username="Hello" />
            </div>

            <div className="profile-icons">
                <div className="icon">
                    <MicOnIcon />
                </div>
                <div className="icon">
                    {(props.cameraCount % 2 === 0) ? 
                    <CameraOnIcon onClick={props.onCamera} /> :
                    <CameraOffIcon onClick={props.offCamera} />}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
