import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { login } = UserAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setErrorMsg("La password deve avere almeno 8 caratteri.");
            return;
        }

        try {
            await login(email, password);
            navigate('/account');
        } catch (e) {
            // e.code: "auth/invalid-credential" (email inesistente o password errata)
            if (e.code === "auth/invalid-credential") {
                setErrorMsg("Email o password non corretti.");
            } else if (e.code === "auth/too-many-requests") {
                setErrorMsg("Troppi tentativi. Riprova più tardi.");
            } else {
                setErrorMsg("Errore durante il login: " + e.message);
            }
            console.log(e);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            {errorMsg && (
                <p
                    className="
        absolute top-12 left-1/2 -translate-x-1/2
        bg-red-100 text-red-700
        border border-red-300
        px-4 py-2 rounded-lg
        text-center text-sm font-medium
        shadow
      "
                    role="alert"
                >
                    {errorMsg}
                </p>
            )}
            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Header viola */}
                <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 py-4 px-6">
                    <h2 className="text-center text-xl font-semibold tracking-tight text-white">
                        Login
                    </h2>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-900"
                            >
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="la_tua_email@esempio.com"
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder-slate-400
                             focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-900"
                                >
                                    Password
                                </label>
                                {/* <Link to="/forgot-password" className="text-xs font-medium text-purple-700 hover:text-purple-800">
                  Password dimenticata?
                </Link> */}
                            </div>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="La tua password"
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder-slate-400
                             focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center items-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white
                           shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Non hai un account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-purple-700 hover:text-purple-800"
                        >
                            Iscriviti
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signin;
