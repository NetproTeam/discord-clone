import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Login() {
    let navigate = useNavigate()
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleLogin = () => {
        // send username to server and check response
        if (input.length !== 0) {
            navigate(`/home/${input}`);
        }
    };

    return (
        <div className="container">
            <img src="/logo.png" alt="logo" width="200"/>
            <form onSubmit={e => {
                e.preventDefault();
            }}>
                <input value={input} onInput={handleInputChange} type="text" placeholder="닉네임을 입력하세요"/>
                <button type={"submit"} onClick={handleLogin}>로그인</button>
            </form>
        </div>
    );
}

export default Login;
