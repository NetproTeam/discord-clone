import React, { useEffect, useRef, useState } from 'react';

function UserCamera() {
    const videoRef = useRef(null);
    const [streaming, setStreaming] = useState(false);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false // 오디오를 포함하고 싶다면 true로 변경
            });
            videoRef.current.srcObject = stream;
            setStreaming(true);

            stream.getVideoTracks()[0].onended = () => {
                stopWebcam();
            };
        } catch (err) {
            console.error("Error: " + err);
        }
    };

    const stopWebcam = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setStreaming(false);
    };

    useEffect(() => {
        startWebcam();
    }, []);

    return (
        <div className="camera">
            <video
                ref={videoRef}
                autoPlay
                style={{ width: '100%', height: 'auto', transform: 'scaleX(-1)' }}>
            </video>
        </div>
    );
}

export default UserCamera;
