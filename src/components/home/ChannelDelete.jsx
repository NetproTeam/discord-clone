import React, {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import CloseIcon from "@mui/icons-material/Close";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import PopError from './PopError';

const ChannelDelete = ({children, onClose, channelId, createdBy,username}) => {
    function deleteChannel() {
        return axios.delete("http://127.0.0.1:8080/channel/" + channelId )
    }

    function getChannelList() {
        return axios.get("http://127.0.0.1:8080/channel")
    }

    const navigate = useNavigate();
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState("");
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setPreviousPath(location.pathname);
    }, [location]);
    useEffect(() => {
        
    }, []);

    const handleOpenError = () => {
        setShowError(true);
    };

    const handleCloseError = () => {
        navigate(previousPath); // Navigate back to the original route
        onClose();
        setShowError(false);
    };

    const handleSubmit = () => {
        getChannelList().then(response => {            
            // 서버에서 접속한 ID 갯수를 'count' 필드로 반환한다고 가정
            let i = 1;
            
            for (let index = 0; index < response.data.length; index++) {
                if(response.data[index].id === channelId){
                    i = index;
                    break; 
                }
            }
            if (response.data[i].clients.length <= 0) {
                if (createdBy != username){
                    alert("채널을 삭제할 권한이 없습니다.");
                    return;
                }
                deleteChannel().then((response) => {
                    navigate(previousPath); // Navigate back to the original route
                    onClose();
                }).catch((error) => {
                        console.error(error)
                    }
                )
            }else{
                handleOpenError();
            }
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
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
                <div className="popError">
                    {showError ? <PopError message = {"채널에 유저가 존재합니다."} 
                    onClose={handleCloseError}/> :
                    <></> }
                </div>
            </div>
        </div>,
        document.getElementById('dialog-root')
    );
};

export default ChannelDelete;