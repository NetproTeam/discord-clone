import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import PopError from "../home/PopError";

function postUserName(username) {
    return axios.post("https://127.0.0.1/login", {name: username})
}

function Login() {
    let navigate = useNavigate()
    const [input, setInput] = useState('');
    const [showError, setShowError] = useState(false);

    const handleOpenError = () => {
        setShowError(true);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleLogin = () => {
        // send username to server and check response
        if (input.length !== 0) {
            postUserName(input).then((response) => {
                const name = encodeURIComponent(response.data.uniqueUserName);
                navigate(`/home/${name}`);
            }).catch((error) => {
                    handleOpenError();
                    console.error(error)
                }
            )
        }
    };

    const hadlePopError = () => {

    }

    return (
        <div className="container">
            <img src="/logo.png" alt="logo" width="200"/>
            <form onSubmit={e => {
                e.preventDefault();
            }}>
                <input value={input} onInput={handleInputChange} type="text" placeholder="닉네임을 입력하세요"/>
                <button
                type={"submit"}
                onClick={handleLogin}>로그인</button>
                <div className="popError">
                    {showError ? <PopError message = {"서버가 가득 찼습니다."} 
                    onClose={handleCloseError}/> :
                    <></> }
                </div>
            </form>
        </div>
    );
}

export default Login;
