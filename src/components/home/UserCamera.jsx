import React, {useEffect, useRef} from 'react';

function UserCamera({stream, isHidden}) {
    const videoRef = useRef({}); 
    useEffect(() =>{
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        } else {
            console.log("[userCamera] change videoRef failed");
            videoRef.current = {};
        }
    },[stream, isHidden]);

    return (
        <div className="camera">
            {
                (isHidden || !stream) ?
                <img src="/dummy-user.png" style={{display: "block", marginLeft: "auto", marginRight: "auto", width: "75%"}}/> 
                :
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{width: '100%', height: '300px', transform: 'scaleX(-1)'}}>
                </video>
            }
        </div>
    );

}

export default UserCamera;
