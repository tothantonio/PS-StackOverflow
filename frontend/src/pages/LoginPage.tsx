import { type FormEvent, useState } from "react";
import {login} from "../services/authService.ts";

function LoginPage(){
    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //previne refreshul automat al browserului

        const data =await login({username,password});//apeleaza login asteapta raspuns pune raspuns in rez

        localStorage.setItem("token", data.token)//salveaza token in browser
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder="Username"
            />

            <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Password"
            />

            <button type="submit">Login</button>
        </form>
    );
}

export default LoginPage;
