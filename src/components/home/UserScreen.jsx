import React, { useEffect, useMemo, useRef } from 'react';
import UserCamera from "./UserCamera";

function UserScreen({localStream, myCameraState, peers}) {

    return (
        <div className="user-screen">
            <div>
                <UserCamera key={0} stream={localStream.current} isHidden={!myCameraState} cnt={0}/>
                {
                    Object.values(peers).map((peer, index) => {
                        if(!peer) return;
                        return (
                            <div key={index+1}>
                                {index+1}
                                <UserCamera key={index + 1} stream={peer.remoteStream} isHidden={false} cnt={index+1}/>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    );
}

export default UserScreen;
