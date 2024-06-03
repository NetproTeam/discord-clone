import React, {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const ChannelEdit = ({children, onClose, initialChannelName,channelId, onSubmit}) => {

    function patchChannelName(channelName) {
        console.log("new name: "+channelName);
        console.log("ori name: "+initialChannelName); 
        return axios.patch("https://127.0.0.1/channel/"+id, { name: channelName }); // 포트 번호 확인
    }
    const [input, setInput] = useState(initialChannelName);
    const [name, setChannelName] = useState(initialChannelName);

    const navigate = useNavigate();
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState("");
    const [id, setId] = useState(channelId);

    useEffect(() => {
        setPreviousPath(location.pathname);
    }, [location]);

    const handleSubmit = () => {
        if (id !== 1) {
            patchChannelName(input).then((response) => {
                onSubmit();
                navigate(previousPath); // Navigate back to the original route
                onClose();
            }).catch((error) => {
                    console.error(error)
                }
            )
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        setChannelName(input);
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