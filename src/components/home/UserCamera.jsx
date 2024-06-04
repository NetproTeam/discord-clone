import React, {useEffect, useRef} from 'react';

function UserCamera({stream, isHidden}) {
    const videoRef = useRef({}); 
    useEffect(() =>{
        if (stream) {
            videoRef.current.srcObject = stream;
        } else if (!videoRef) {
            videoRef.current = {};
        }
    },[stream]);

    return (
        <div className="camera">
            {
                (!stream) ?
                <img src="/dummy-user.png" style={{display: "block", marginLeft: "auto", marginRight: "auto", width: "75%"}}/> 
                :
                <video
                    ref={videoRef}
                    autoPlay
                    style={{width: '100%', height: '300px', transform: 'scaleX(-1)'}}>
                </video>
            }
        </div>
    );

}

export default UserCamera;
