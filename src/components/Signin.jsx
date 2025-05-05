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
     return (
                <div className="min-h-screen flex items-center justify-center bg-blue-100 py-12 px-4 sm:px-6 lg:px-8"> {/* Contenitore principale */}
                    <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"> {/* Contenitore bianco */}
                        <div className="bg-purple-600 py-4 px-6"> {/* Intestazione viola */}
                            <h2 className="mt-2 text-center text-xl font-semibold tracking-tight text-white">Login</h2>
                        </div>
                        <div className="p-6 space-y-6"> {/* Contenuto del form */}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                                    <div className="mt-1">
                                        <input
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="la_tua_email@esempio.com"
                                        />
                                    </div>
                                </div>
        
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                                        <div className="text-sm">
                                            {/* <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">Hai dimenticato la password?</Link> */}
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="La tua password"
                                        />
                                    </div>
                                </div>
        
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
        
                            <p className="mt-6 text-center text-sm text-gray-500">
                                Non hai un account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Iscriviti</Link>
                            </p>
                        </div>
                    </div>
                </div>
            );
}

export default Signin;