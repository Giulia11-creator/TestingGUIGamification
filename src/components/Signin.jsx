import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {UserAuth}from '../context/AuthContext';
const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = UserAuth();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        //setError('');
        try {
            await login(email,password);
            navigate('/account');
        } catch (e) {
            //setError(e.message);
            console.log(e.message);
        }

    }
    return(
        <div className="max-w-[700px] mx-auto my-16 p-4">
            <div>
             <h2 className=" text-2xl font-bold">Login</h2>
             <p className="py-2">Non hai un account? <Link to="/signup" className="underline">Iscriviti</Link></p>
             </div>
             <form onSubmit={handleSubmit}>
                <div className="flex flex-col py-2">
                    <label className="py-2 font-medium" >Email</label>
                    <input onChange={(e)=>setEmail(e.target.value)} className="border p-3" type='email'/>
                </div>
                <div className="flex flex-col py-2">
                    <label className="py-2 font-medium">Password</label>
                    <input onChange={(e)=>setPassword(e.target.value)} className="border p-3" type='password'/>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-4 rounded my-2 w-full ">Sign in</button>
             </form>
        </div>
    );
}

export default Signin;