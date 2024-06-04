import React, {useEffect, useRef} from 'react';

function UserCamera({stream, isHidden}) {
    const videoRef = useRef(null);


    // const startWebcam = async () => {
    //     try {
    //         videoRef.current.srcObject = stream;
    //         console.log("[by sh] stream added to videoRef")
    //     } catch (err) {
    //         console.error("Error: " + err);
    //     }
    // };


    // const stopWebcam = () => {
    //     try {
    //         if (!stream) return;
    //         const tracks = stream.getTracks();

    //         tracks.forEach(track => track.stop());
    //         videoRef.current.srcObject = null;
    //     } catch (e) {
    //         console.error(e)
    //     }
    // };

    // useEffect(() => {
    //     if (myCameraState) {
    //         startWebcam()
    //     } else {
    //         stopWebcam()
    //     }
    // }, [myCameraState])

    return (
        <div className="camera">
            {
                (isHidden || !stream) ?
                <img src="/dummy-user.png" style={{display: "block", marginLeft: "auto", marginRight: "auto", width: "75%"}}/> :
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
