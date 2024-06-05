import React, { useEffect, useMemo, useRef } from 'react';
import UserCamera from "./UserCamera";

function UserScreen({localStream, myCameraState, streams}) {
    console.log("streams", streams)
    return (
        <div className="user-screen">
            <div>
                <UserCamera key={localStream.id} stream={localStream} isHidden={!myCameraState}/>

                {streams.map((stream, index) => (
                    <UserCamera key={stream.stream.id} stream={stream.stream} isHidden={false}/>
                ))}
            </div>

        </div>
    );
}

export default UserScreen;
