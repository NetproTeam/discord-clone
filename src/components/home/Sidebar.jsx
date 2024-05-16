import React from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add"
import CameraOnIcon from "@mui/icons-material/Videocam";
import CameraOffIcon from "@mui/icons-material/VideocamOff";
import MicOnIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ChannelList from "./ChannelList";


function Sidebar(props) {
    return (
        <div className="col-md-2 sidebar" style={{paddingLeft: "0px", paddingRight: "0px"}}>
            <div className="top">
                <h3>{props.username}</h3>
                <ExpandMoreIcon/>
            </div>

            <div className="channels">
                <div className="channels-header">
                    <div className="header">
                        <ExpandMoreIcon/>
                        <h5>음성 체널</h5>
                    </div>
                    <AddIcon/>
                </div>
                <ChannelList channelName="Test1" username="Hello"/>
            </div>

            <div className="profile-icons">
                <div className="icon">
                    <MicOnIcon />
                </div>
                <div className="icon">
                    <CameraOnIcon />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;