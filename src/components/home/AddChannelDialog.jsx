import React, {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const AddChannelDialog = ({children, onClose}) => {

    function postChannelName(channelName) {
        return axios.post("http://127.0.0.1:8080/channel", {name: channelName})
    }
    const navigate = useNavigate();
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState("");

    const [input, setInput] = useState("");

    useEffect(() => {
        setPreviousPath(location.pathname);
    }, [location]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = () => {
        if (input.length !== 0) {
            postChannelName(input).then((response) => {
                navigate(previousPath); // Navigate back to the original route
                onClose();
            }).catch((error) => {
                    console.error(error)
                }
            )
        }
    };

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
                    <input 
                    placeholder="새로운 채널" 
                    value={input} 
                    onInput={handleInputChange}/>
                </div>

                <div className="bottom">
                    <button onClick={onClose} className="cancel">취소</button>
                    <button onClick={handleSubmit} className="make">채널 만들기</button>
                </div>
            </div>
        </div>,
        document.getElementById('dialog-root')
    );
};

export default AddChannelDialog;