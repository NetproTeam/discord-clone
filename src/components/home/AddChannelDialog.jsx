import React, {useState} from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close"

const AddChannelDialog = ({children, onClose}) => {
    const [input, setInput] = useState("");


    return createPortal(
        <div className="dialog">
            <div className="content">
                {children}
                <div className="title">
                    <h3>채널 만들기</h3>
                    <CloseIcon onClick={onClose}/>
                </div>
                <div className="body">
                    <h5>채널 이름</h5>
                    <input placeholder="새로운 채널" />
                </div>

                <div className="bottom">
                    <button className="cancel">취소</button>
                    <button className="make">채널 만들기</button>
                </div>
            </div>
        </div>,
        document.getElementById('dialog-root')
    );
};

export default AddChannelDialog;