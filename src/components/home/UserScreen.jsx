import React, {useState} from 'react';
import UserCamera from "./UserCamera";
import CameraOnIcon from "@mui/icons-material/Videocam";
import CameraOffIcon from "@mui/icons-material/VideocamOff";

function UserScreen(props) {
    const [input, setCam] = useState("");

    return (
        <div className="user-screen">
            <div>
                <UserCamera key={0} myCameraState={props.myCameraState}/>

                {[...Array(props.cameraCount)].map((_, index) => (
                    <UserCamera key={index + 1} myCameraState={props.myCameraState}/>
                ))}
            </div>

        </div>
    );
}

export default UserScreen;
