import React, {useEffect, useRef, useState} from 'react';

function UserCamera({myCameraState, remoteVideo, isCameraOn}) {
    const videoRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const startWebcam = async () => {
        try {
            if (remoteVideo === undefined) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false // 오디오를 포함하고 싶다면 true로 변경
                });
                videoRef.current.srcObject = stream;
                setStreaming(true);
            }
        } catch (err) {
            console.error("Error: " + err);
        }
    };


    const stopWebcam = () => {
        try {
            if (!isCameraOn || !videoRef.current.srcObject) return;
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        } catch (e) {
            console.error(e)
        }
    };

    useEffect(() => {
        if (myCameraState) {
            startWebcam()
        } else {
            stopWebcam()
        }
    }, [myCameraState])

    return (
        <div className="camera">
            {
                (!remoteVideo && myCameraState) || isCameraOn ?
                    <video
                        ref={remoteVideo ? remoteVideo : videoRef}
                        autoPlay
                        style={{width: '100%', height: '300px', transform: 'scaleX(-1)'}}>
                    </video>
                    :
                    <img src="/dummy-user.png" style={{display: "block", marginLeft: "auto", marginRight: "auto", width: "75%"}}/>
            }
        </div>
    );

}

export default UserCamera;
