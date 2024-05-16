import React from 'react';
import UserCamera from "./UserCamera";

function UserScreen() {
    return (
            <div className="user-screen">
                <div >
                    <UserCamera/>
                    <UserCamera/>
                    <UserCamera/>
                    <UserCamera/>
                </div>
            </div>
    );
}

export default UserScreen;