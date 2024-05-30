import React, {useState} from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close"

const ChannelDelete = ({children, onClose}) => {
    const [input, setInput] = useState("");


    return createPortal(
        <div className="dialog">
            <div className="content">
                {children}
                <div className="title">
                    <h3>채널 삭제하기</h3>
                    <CloseIcon onClick={onClose}/>
                </div>
                <div className="body" style={{width:"400px", height: "50px"}}>
                <h3>정말로 채널을 삭제하실 겁니까?</h3>
                </div>

                <div className="bottom">
                    <button onClick={onClose} className="cancel">취소</button>
                    <button className="delete">삭제하기</button>
                </div>
            </div>
        </div>,
        document.getElementById('dialog-root')
    );
};

export default ChannelDelete;