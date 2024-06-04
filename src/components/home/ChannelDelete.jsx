import React, {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const ChannelDelete = ({children, onClose, channelId}) => {

    function deleteChannel() {
        return axios.delete("https://127.0.0.1/channel/" + id)
    }

    const navigate = useNavigate();
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState("");
    const [id, setId] = useState(channelId);
    const [name, setChannelName] = useState("");

    useEffect(() => {
        setPreviousPath(location.pathname);
    }, [location]);
    useEffect(() => {
        
    }, []);

    const handleSubmit = () => {
        if (id !== 1) {
            deleteChannel().then((response) => {
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
                    <h3>채널 삭제하기</h3>
                    <CloseIcon onClick={onClose}/>
                </div>
                <div className="body" style={{width:"400px", height: "50px"}}>
                <h3>정말로 채널을 삭제하실 겁니까?</h3>
                </div>

                <div className="bottom">
                    <button onClick={onClose} className="cancel">취소</button>
                    <button onClick={handleSubmit} className="delete">삭제하기</button>
                </div>
            </div>
        </div>,
        document.getElementById('dialog-root')
    );
};

export default ChannelDelete;