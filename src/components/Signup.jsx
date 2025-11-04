import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { createUser } = UserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ validazione password
        if (password.length < 8) {
            setErrorMsg("La password deve contenere almeno 8 caratteri.");
            return;
        }

        try {
            await createUser(email, password);
            navigate("/account");

        } catch (e) {
            console.log(e.code);

            if (e.code === "auth/email-already-in-use") {
                setErrorMsg("Utente esistente.");
            } else if (e.code === "auth/invalid-email") {
                setErrorMsg("Inserisci una email valida.");
            } else {
                setErrorMsg("Errore durante la registrazione.");
            }
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            {/* Card */}
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
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Header gradiente */}
                <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 py-4 px-6">
                    <h2 className="text-center text-xl font-semibold tracking-tight text-white">
                        Iscrizione
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
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-900"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
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
                                Sign up
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Hai già un account?{" "}
                        <Link
                            to="/signin"
                            className="font-medium text-purple-700 hover:text-purple-800"
                        >
                            Accedi
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
