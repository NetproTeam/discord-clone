import React, {useEffect, useRef, useState} from 'react';

function UserVoice(props) {
    const [isStarted, setIsStarted] = useState(false);
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);

    const startVoice = async () => {
    try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = localStream;

        // Create a new RTCPeerConnection
        const peerConnection = new RTCPeerConnection();
        peerConnectionRef.current = peerConnection;

        // Add local stream to the peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Handle ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
            // Send the candidate to the remote peer
            console.log('ICE Candidate:', event.candidate);
            }
        };
        
        setIsStarted(true);
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
};

  const endVoice = () => {
    if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
    }
    setIsStarted(false);
  };
  useEffect(() => {
    if (props.micState){
        startVoice();
    }else{
        endVoice();
    }
}, [props.micState])

    return (
        <div className="mic">
        </div>
    );
}

export default UserVoice;
