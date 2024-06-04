import React, {useEffect, useState, useRef} from 'react';
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
import PropTypes from "prop-types";

function useInterval(callback, delay) {
    const savedCallback = useRef();
   
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
   
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}

function getChannelList() {
    return axios.get("https://127.0.0.1/channel")
}

function Sidebar({currentChannelList, setChannelList, channelName, setChannelName, setId, myMikeState, setMyMikeState, setMyCameraState, myCameraState, username}) {
    const [showDialog, setShowDialog] = useState(false);

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        resetList();
        setShowDialog(false);
    };

    useInterval(() => {
        resetList();
    }, 1000);

    const resetList = () => {
        getChannelList().then((response) => {
            setChannelList(response.data.sort((a, b) => a.id - b.id));
        }).catch((error) => {
            console.error(error);
        })
    }

    const setChannel = (name, id) => {
        setChannelName(name);
        setId(id);
    }

    return (
        <div className="col-md-2 sidebar" style={{paddingLeft: "0px", paddingRight: "0px"}}>
            <div className="top">
                <h3>{username}</h3>
                <ExpandMoreIcon/>
            </div>

            <div className="channels">
                <div className="channels-header">
                    <div className="header">
                        <h5>음성 체널</h5>
                    </div>
                    <AddIcon onClick={handleOpenDialog} name={channelName}/>

                    {showDialog && <Dialog onClose={handleCloseDialog}/>}
                </div>
                {
                    currentChannelList && currentChannelList.map((data) => {
                        return <ChannelList key={data.id} onReset={resetList} channelId={data.id} channelName={data.name}
                                            setChannel={setChannel} client={data.clients}/>
                    })
                }
            </div>

            <div className="profile-icons">
                <div className="icon">
                    {(myMikeState) ?
                        <MicOnIcon onClick={setMyMikeState}/> :
                        <MicOffIcon onClick={setMyMikeState}/>}
                    {/* <UserVoice micState={myMikeState}/> */}
                </div>
                <div className="icon">
                    {(myCameraState) ?
                        <CameraOnIcon onClick={setMyCameraState}/> :
                        <CameraOffIcon onClick={setMyCameraState}/>}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
