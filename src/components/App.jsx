import React from "react";
import Login from "./login/Login";
import Home from "./home/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/home/:username" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
