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
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login</h2>
          </div>
    
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email</label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    required
                    style={{ border: '1px solid black' }}
                    className="block w-full rounded-md bg-white **border border-gray-300** px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
    
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                  <div className="text-sm">
                    {/* Potresti aggiungere qui un link per "Hai dimenticato la password?" */}
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    required
                    style={{ border: '1px solid black' }}
                     className="block w-full rounded-md bg-white **border border-gray-300** px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
    
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
    
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Non hai un account?<Link to="/signup" className="underline">  Iscriviti</Link>
            </p>
          </div>
        </div>
      );
}

export default Signin;