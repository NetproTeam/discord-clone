import React, {useEffect, useState} from 'react';
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
import axios from "axios";

function getChannelList() {
    return axios.get("https://127.0.0.1/channel")
}

function Sidebar(props) {
    const [showDialog, setShowDialog] = useState(false);
    const [channelList, setChannelList] = useState(null);

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        resetList();
        setShowDialog(false);
    };

    const resetList = () => {
        getChannelList().then((response) => {
            setChannelList(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }

    

    useEffect(() => {
        getChannelList().then((response) => {
            setChannelList(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }, []);

    return (
        <div className="col-md-2 sidebar" style={{paddingLeft: "0px", paddingRight: "0px"}}>
            <div className="top">
                <h3>{props.username}</h3>
                <ExpandMoreIcon/>
            </div>

            <div className="channels">
                <div className="channels-header">
                    <div className="header">
                        <h5>음성 체널</h5>
                    </div>
                    <AddIcon onClick={handleOpenDialog} channelName={props.channelName}/>

                    {showDialog && <Dialog  onClose={handleCloseDialog}/>}
                </div>
                {
                    channelList && channelList.map((data) => {
                        return <ChannelList key={data.id} onReset = {resetList} channelId = {data.id} channelName={data.name}/>
                    })
                }
            </div>

            <div className="profile-icons">
                <div className="icon">
                    {(props.myMikeState) ?
                        <MicOnIcon onClick={props.offMike}/> :
                        <MicOffIcon onClick={props.onMike}/>}
                    <UserVoice micState={props.myMikeState}/>
                </div>
                <div className="icon">
                    {(props.myCameraState) ?
                        <CameraOnIcon onClick={props.offCamera}/> :
                        <CameraOffIcon onClick={props.onCamera}/>}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
