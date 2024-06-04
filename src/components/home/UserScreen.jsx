import React from 'react';
import UserCamera from "./UserCamera";
import { useEffect } from 'react';

function UserScreen({myCameraState, remoteVideo, cameraCount, cameraList}) {
    console.log("cameraCount", cameraCount)

    let localStream = null;

    const turnOnMyCam = async () => {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false // 오디오를 포함하고 싶다면 true로 변경
            });
        } catch (err) {
            console.error("Error: " + err);
        }
    };

    const turnOffMyCam = () => {
        try {
            if (!localStream) return;
            const tracks = localStream.getTracks();

            tracks.forEach(track => track.stop());
            localStream = null;
        } catch (e) {
            console.error(e)
        }
    };

    useEffect(() => {
        if (myCameraState) {
            turnOnMyCam()
        } else {
            turnOffMyCam()
        }
    }, [myCameraState])

    return (
        <div className="user-screen">
            <div>
                <UserCamera key={0} stream={localStream}/>

                {/* {[...Array(cameraCount)].map((_, index) => (
                    <UserCamera key={index + 1} myCameraState={myCameraState} remoteVideo={remoteVideo} isCameraOn={cameraList[index].isCameraOn}/>
                ))} */}
            </div>

        </div>
    );
}

export default UserScreen;
