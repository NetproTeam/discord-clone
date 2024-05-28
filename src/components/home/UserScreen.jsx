import React, {useState} from 'react';
import UserCamera from "./UserCamera";
import CameraOnIcon from "@mui/icons-material/Videocam";
import CameraOffIcon from "@mui/icons-material/VideocamOff";

function UserScreen(props) {
    const [input, setCam] = useState("");
    
    return (
        <div className="user-screen">
            <div>
                {[...Array(props.cameraCount)].map((_, index) => (
                    <UserCamera key={index} />
                ))}
            </div>
            
        </div>
    );
}

export default UserScreen;
