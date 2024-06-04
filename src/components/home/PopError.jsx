import React, {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const PopError = ({children, onClose}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState("");
    const [name, setChannelName] = useState("");

    useEffect(() => {
        setPreviousPath(location.pathname);
    }, [location]);
    useEffect(() => {
        
    }, []);


    return createPortal(
        <div className="dialog">
            <div className="content">
                {children}
                <div className="title">
                    <h3>알림</h3>
                    <CloseIcon onClick={onClose}/>
                </div>
                <div className="body" style={{width:"400px", height: "50px"}}>
                <h3>서버가 가득 찼습니다.</h3>
                </div>

                <div className="bottom">
                    <button onClick={onClose} className="cancel">취소</button>
                    <button onClick={onClose} className="delete">확인</button>
                </div>
            </div>
        </div>,
        document.getElementById('dialog-root')
    );
};

export default PopError;