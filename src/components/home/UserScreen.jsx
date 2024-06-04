import React, {useState} from 'react';
import UserCamera from "./UserCamera";
import CameraOnIcon from "@mui/icons-material/Videocam";
import CameraOffIcon from "@mui/icons-material/VideocamOff";

function UserScreen({myCameraState, remoteVideo, cameraCount}) {
    const [input, setCam] = useState("");
    console.log("cameraCount", cameraCount)
    return (
        <div className="user-screen">
            <div>
                <UserCamera key={0} myCameraState={myCameraState}/>

                {[...Array(cameraCount)].map((_, index) => (
                    <UserCamera key={index + 1} myCameraState={myCameraState} remoteVideo={remoteVideo}/>
                ))}
            </div>

        </div>
    );
}

export default UserScreen;
