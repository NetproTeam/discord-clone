import React from 'react';
import UserCamera from "./UserCamera";

function UserScreen({myCameraState, myMikeState, peers, localStream}) {
    return (
        <div className="user-screen">
            <div>
                <UserCamera key={0} stream={localStream} isHidden={!myCameraState}/>

                {Object.values(peers.current).map((peer, index) => (<UserCamera key={index + 1} stream={peer.remoteStream} isHidden={false} />))}
            </div>

        </div>
    );
}

export default UserScreen;
