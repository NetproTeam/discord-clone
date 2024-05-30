import React, {useState} from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close"

const ChannelEdit = ({children, onClose, initialChannelName, onSubmit}) => {
    const [input, setInput] = useState(initialChannelName);
    const [name, setChannelName] = useState(initialChannelName);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        setChannelName(input);
    };

    const handleSubmit = () => {
        onSubmit(input); // Pass the new name to the parent component
    };

    return createPortal(
        <div className="dialog">
            <div className="content">
                {children}
                <div className="title">
                    <h3>채널이름 변경하기</h3>
                    <CloseIcon onClick={onClose}/>
                </div>
                <div className="body">
                    <h5>채널 이름</h5>
                    <input 
                        placeholder={`#${name}`}
                        onChange={handleInputChange}/>
                </div>
                <div className="bottom">
                    <button onClick={onClose} className="cancel">취소</button>
                    <button onClick={handleSubmit} className="make">변경하기</button>
                </div>
            </div>
        </div>,
        document.getElementById('dialog-root')
    );
};

export default ChannelEdit;