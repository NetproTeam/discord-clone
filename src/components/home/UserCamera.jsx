import React, {useEffect, useRef, useState} from 'react';

function UserCamera({myCameraState, remoteVideo}) {
    const videoRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    console.log("remoteVideo")
    console.log(remoteVideo)
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
            if(!videoRef.current.srcObject) return;
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
            {remoteVideo ? <div>상대방</div> : <div>나</div>}
            <video
                ref={remoteVideo ? remoteVideo : videoRef}
                autoPlay
                style={{width: '100%', height: '300px', transform: 'scaleX(-1)'}}>
            </video>
        </div>
    );
    
}

export default UserCamera;
