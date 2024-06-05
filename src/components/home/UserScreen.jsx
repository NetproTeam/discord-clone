import React from 'react';
import UserCamera from "./UserCamera";

function UserScreen({localStream, myCameraState, peers}) {

    return (
        <div className="user-screen">
            <div>
                <div>
                    <h3>me</h3>
                    <UserCamera stream={localStream} isHidden={!myCameraState} />
                </div>
                {
                    Object.keys(peers).map((peerName) => {
                        if (peers[peerName] && peers[peerName].remoteStream) {
                            return (
                                <div key = {peerName}>
                                    <h3>{peerName}</h3>
                                    <UserCamera key={peerName} stream={peers[peerName].remoteStream} isHidden={false} />
                                </div>
                            );
                        }
                        return ;
                    })
                }
            </div>

        </div>
    );
}

export default UserScreen;
