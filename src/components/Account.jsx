import React from "react";
import { UserAuth } from "../context/AuthContext";
import {Link, useNavigate} from 'react-router-dom';
const Account = () => {
    const {user, logout} = UserAuth();
    const navigate = useNavigate();
    const handleLogout = async() =>{
        try {
            await logout();
            navigate('/');
        } catch (e) {
            console.log(e.message);
            
        }
    }
    return(
        <div className="max-auto my-16 p-4">
            <h1 className="text-center text-3xl font-bold">Account</h1>
            <p>User email: {user && user.email}</p>
            <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-4 rounded my-2 w-[100px] ">Logout</button>
        </div>
    );
}

export default Account;