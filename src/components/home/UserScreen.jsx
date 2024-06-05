import React from 'react';
import UserCamera from "./UserCamera";

function UserScreen({localStream, myCameraState, peers}) {

    return (
        <div className="user-screen">
            <div>
                <UserCamera key={0} stream={localStream} isHidden={!myCameraState}/>
                {
                    Object.values(peers).map((peer, index) => (
                        <div key={index+1}>
                            {index+1}
                            <UserCamera key={index + 1} stream={peer.remoteStream} isHidden={false}/>
                        </div>
                    ))
                }
            </div>

        </div>
    );
}

export default UserScreen;
