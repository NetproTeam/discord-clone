import React, {useEffect, useState, useRef} from 'react';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CameraOnIcon from "@mui/icons-material/Videocam";
import CameraOffIcon from "@mui/icons-material/VideocamOff";
import MicOnIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ChannelList from "./ChannelList";
import Dialog from "./AddChannelDialog";
import axios from "axios";

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
    return axios.get("http://127.0.0.1:8080/channel")
}

function Sidebar({currentChannelList, setChannelList, channelName, setChannel, myMikeState, setMyMikeState, setMyCameraState, myCameraState, username}) {
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
                    <AddIcon onClick={handleOpenDialog} name={channelName} username={username}/>

                    {showDialog && <Dialog onClose={handleCloseDialog} username={username}/>}
                </div>
                {
                    currentChannelList && currentChannelList.map((data) => {
                        return <ChannelList key={data.id + data.name} onReset={resetList} channelId={data.id} channelName={data.name}
                                            setChannel={setChannel} client={data.clients} createdBy={data.createdBy} username={username}/>
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
