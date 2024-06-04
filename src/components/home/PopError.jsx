import React from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close";

const PopError = ({children, onClose, message}) => {
    return createPortal(
        <div className="dialog">
            <div className="content">
                {children}
                <div className="title">
                    <h3>알림</h3>
                    <CloseIcon onClick={onClose}/>
                </div>
                <div className="body" style={{width:"400px", height: "50px"}}>
                <h3>{message}</h3>
                </div>

                <div className="bottom">
                    <button onClick={onClose} className="delete">확인</button>
                </div>
            </div>
        </div>,
        document.getElementById('dialog-root')
    );
};

export default PopError;