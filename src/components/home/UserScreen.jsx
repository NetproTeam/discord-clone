import React, { useEffect, useMemo, useRef } from 'react';
import UserCamera from "./UserCamera";

function UserScreen({localStream, myCameraState, streams}) {
    return (
        <div className="user-screen">
            <div>
                <UserCamera key={0} stream={localStream} isHidden={!myCameraState}/>

                {streams.map((stream, index) => (
                    <UserCamera key={index + 1} stream={stream.stream} isHidden={false}/>
                ))}
            </div>

        </div>
    );
}

export default UserScreen;
