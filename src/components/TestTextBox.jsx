import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { addUser } from "./FirestoreFunction.js";
import { UserAuth } from "../context/AuthContext";
import { FaUserCircle } from 'react-icons/fa';

const TestTextBox = () => {
    const [input, setInput] = useState('');
    const [risultato, setRisultato] = useState(null);
    const [errore, setErrore] = useState(false);
    const [messaggioErrore, setMessaggioErrore] = useState('');
    const [bug1Trovato, setBug1Trovato] = useState(false);
    const [bug2Trovato, setBug2Trovato] = useState(false);
    const [bug3Trovato, setBug3Trovato] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const { user } = UserAuth();
    const [score, setScore] = useState(0);


    const calcola = (e) => {
        e.preventDefault();
        try {
            if (/[a-zA-Z]/.test(input) && !bug1Trovato) {
                setBug1Trovato(true);
                setErrore(true);
                setMessaggioErrore("🔤 Congratulazioni! Hai trovato un bug di validazione logica. La calcolatrice permette di inserire lettere (come a, b, x) nella casella di testo, anche se dovrebbe accettare solo numeri e operatori aritmetici. Questo tipo di errore deriva da una mancanza di controllo sull’input: il programma non verifica che i caratteri digitati siano validi prima di provare a eseguire il calcolo. È un bug di validazione logica, perché il flusso logico dell’app non distingue tra input numerici e alfabetici, portando a errori di esecuzione o risultati non definiti.");
            } else if (/[#?&$£!]/.test(input) && !bug2Trovato) {
                setBug2Trovato(true);
                setErrore(true);
                setMessaggioErrore("❌ Ottimo lavoro! Hai individuato un bug di validazione sintattica. L’applicazione permette di inserire simboli speciali come ?, @, # o !, che non fanno parte delle operazioni matematiche. Questo bug è di tipo sintattico, perché riguarda la forma dell’input: la calcolatrice non riconosce che questi simboli non sono ammessi e li passa comunque al motore di calcolo. Il risultato può essere un errore di parsing o un crash del componente di valutazione.");
            } else if (input === "" && !bug3Trovato) {
                setBug3Trovato(true);
                setErrore(true);
                setMessaggioErrore("⚠️ Ben fatto! Hai scoperto un bug di validazione dell’input utente. La calcolatrice consente di premere “Calcola” anche se la casella di testo è vuota. Questo è un bug di validazione funzionale, perché l’app non controlla che l’utente abbia inserito qualcosa prima di procedere. Il comportamento corretto sarebbe bloccare il calcolo e mostrare un messaggio d’errore del tipo “Inserisci un’espressione valida prima di calcolare”. Si tratta di un problema comune nelle interfacce non protette da controlli preliminari (guard clauses)");
            } else if (/[a-zA-Z]/.test(input) && bug1Trovato) {
                setErrore(true);
                setMessaggioErrore("Hai già trovato il bug delle lettere!");
            } else if (/[#?&$£!]/.test(input) && bug2Trovato) {
                setErrore(true);
                setMessaggioErrore("Hai già trovato il bug del simbolo non accettabile!");
            } else if (input === "" && bug3Trovato) {
                setErrore(true);
                setMessaggioErrore("Hai già trovato il bug dell'input vuoto!");
            } else {
                setErrore(false);
                setMessaggioErrore('');
                const risultato = eval(input);
                setRisultato(risultato);
            }
        } catch (error) {
            setErrore(true);
            setMessaggioErrore(error.message);
            setRisultato(null);
        }
    };

    useEffect(() => {
        let currentScore = 0;
        if (bug1Trovato) currentScore += 33;
        if (bug2Trovato) currentScore += 33;
        if (bug3Trovato) currentScore += 34;
        setScore(currentScore);
    }, [bug1Trovato, bug2Trovato, bug3Trovato]);

    useEffect(() => {
        (async () => {
            if (user) {
                await addUser("TextBox", user.uid, { score, email: user.email });
            }
        })();
    }, [score, user]);

    useEffect(() => {
        if (score === 100 && user) {
            setModalVisible(true);
        }
    }, [score, user]);

    const resettaErrore = () => {
        setErrore(false);
        setMessaggioErrore('');
        setInput('');
    };

    const closeModal = () => {
        setModalVisible(false);
        navigate("/account");
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            {/* Topbar */}
            <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-purple-200 shadow-sm">
                <div className="max-w-[1200px] mx-auto px-5 py-3 flex items-center justify-between">
                    {/* Sinistra: saluto */}
                    <span className="text-lg md:text-xl text-slate-600">
                        <span className="text-purple-800 font-semibold">
                            Ciao, {user?.email?.split('@')[0] || 'utente'}
                        </span>
                    </span>

                    {/* Destra: chip punteggio + icona account */}
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full font-semibold shadow-sm"
                            aria-live="polite"
                            title="Punteggio"
                        >
                            <span className="text-sm">Punteggio</span>
                            <span className="text-base tabular-nums">{score}</span>
                        </div>

                        <button
                            type="button"
                            className="rounded-full p-1.5 bg-purple-200 hover:bg-purple-300 transition-colors"
                            aria-label="Vai al profilo"
                            onClick={() => navigate('/account')}
                        >
                            <FaUserCircle className="text-purple-800 text-3xl" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Contenuto principale */}
            <div className="flex-1">
                <div className="max-w-[1200px] mx-auto px-5 py-8">
                    <div className="mx-auto w-full max-w-md">
                        {/* Card Calcolatrice */}
                        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden">
                            {/* Header viola */}
                            <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 py-4 px-6">
                                <h2 className="text-center text-xl font-semibold text-white tracking-tight">
                                    Mini Calcolatrice
                                </h2>
                            </div>

                            <div className="px-6 py-5">
                                {/* Barra “bug”/progress emojii */}
                                <div className="mb-5 text-center text-2xl">
                                    {'🪲'.repeat(Math.floor(score / 30))}
                                </div>

                                {/* Form */}
                                <form onSubmit={calcola} className="space-y-3">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            setRisultato(null);
                                        }}
                                        placeholder="Scrivi un'espressione (es: 3+5)"
                                        className={`w-full px-4 py-2.5 rounded-lg border bg-white placeholder-slate-400
                    focus:outline-none focus:ring-4 focus:ring-purple-200 transition
                    ${errore ? 'border-red-400 bg-slate-50 text-slate-500 cursor-not-allowed' : 'border-slate-300'}
                  `}
                                        disabled={errore}
                                        aria-invalid={!!errore}
                                    />

                                    <button
                                        type="submit"
                                        className={`w-full py-2.5 rounded-lg text-white font-semibold transition
                    focus:outline-none focus:ring-4
                    ${errore
                                                ? 'bg-slate-400 cursor-not-allowed focus:ring-slate-300'
                                                : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-300'
                                            }`}
                                        disabled={errore}
                                    >
                                        Calcola
                                    </button>
                                </form>

                                {/* Messaggi */}
                                {errore && (
                                    <div
                                        className="mt-5 p-4 bg-purple-50 border border-purple-300 text-purple-800 rounded-xl relative"
                                        role="alert"
                                    >
                                        <strong className="font-semibold">Errore: </strong>
                                        {messaggioErrore}
                                        <button
                                            onClick={resettaErrore}
                                            className="absolute top-2.5 right-3 text-purple-700 hover:text-red-700 font-bold"
                                            aria-label="Chiudi errore"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}

                                {risultato !== null && !errore && (
                                    <div
                                        className="mt-5 p-4 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-xl"
                                        aria-live="polite"
                                    >
                                        <p className="text-lg font-semibold">
                                            Risultato: <span className="tabular-nums">{risultato}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal di completamento */}
            {modalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center">
                        <h3 className="text-2xl font-semibold mb-3 text-purple-700">
                            Ottimo lavoro!
                        </h3>
                        <p className="mb-6 text-slate-700">
                            Hai trovato tutti i bug! Puoi passare al prossimo gruppo di test!
                        </p>
                        <button
                            onClick={closeModal}
                            className="inline-flex items-center justify-center bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-semibold transition"
                        >
                            Ok, torna alla Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default TestTextBox;
