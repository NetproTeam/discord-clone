import React, { useEffect, useRef } from 'react';
import UserCamera from "./UserCamera";

function UserScreen({myCameraState, myMikeState, cameraList}) {
    const localStream = useRef(null);
    const turnOnMyCam = async () => {
        try {
            localStream.current = await navigator.mediaDevices.getUserMedia({
                video: myCameraState,
                audio: myMikeState
            });
            
        } catch (err) {
            console.error("Error: " + err);
        }
    };

    const turnOffMyCam = () => {
        try {
            if (!localStream.current) return;
            const tracks = localStream.current.getTracks();

            tracks.forEach(track => track.stop());
            localStream.current = null;
        } catch (e) {
            console.error(e)
        }
    };

    useEffect(() => {
        if (myCameraState || myMikeState) {
            turnOnMyCam()
        } else {
            turnOffMyCam()
        }
    }, [myCameraState, myMikeState])

    return (
        <div className="user-screen">
            <div>
                <UserCamera key={0} stream={localStream.current} isHidden={!myCameraState}/>

                {cameraList.map((camera, index) => (
                    <UserCamera key={index + 1} stream={null} isHidden={true}/>
                ))}
            </div>

        </div>
    );
}

export default UserScreen;
