import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { UserAuth } from "../context/AuthContext";

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

    async function addUser() {
        const userRef = doc(db, "TextBox", user.uid);

        try {
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                await setDoc(userRef, {
                    percentage: String(score),
                    lastUpdate: serverTimestamp(),
                }, { merge: true });
                console.log("Utente aggiornato con nuovo score e timestamp.");
            } else {
                await setDoc(userRef, {
                    id: user.uid,
                    percentage: String(score),
                    createdAt: serverTimestamp(),
                    lastUpdate: serverTimestamp(),
                });
                console.log("Nuovo utente creato.");
            }
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
        }
    }

    const calcola = (e) => {
        e.preventDefault();

        try {
            if (/[a-zA-Z]/.test(input) && !bug1Trovato) {
                setBug1Trovato(true);
                setErrore(true);
                setMessaggioErrore("L'espressione contiene lettere! Hai trovato un bug!");
            } else if (/[#?&$£!]/.test(input) && !bug2Trovato) {
                setBug2Trovato(true);
                setErrore(true);
                setMessaggioErrore("L'espressione contiene un simbolo non accettabile! Hai trovato un bug!");
            } else if (input === "" && !bug3Trovato) {
                setBug3Trovato(true);
                setErrore(true);
                setMessaggioErrore("L'espressione è vuota! Hai trovato un bug!");
            } else if (/[a-zA-Z]/.test(input) && bug1Trovato) {
                setErrore(true);
                setMessaggioErrore("Hai già trovato il bug delle lettere!");
            } else if (/[#?&$£!]/.test(input) && bug2Trovato) {
                setErrore(true);
                setMessaggioErrore("Hai già trovato il bug  del simbolo non accettabile!");
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
        if (bug1Trovato) {
            currentScore += 33;
        }
        if (bug2Trovato) {
            currentScore += 33;
        }
        if (bug3Trovato) {
            currentScore += 34;
        }
        setScore(currentScore);
    }, [bug1Trovato, bug2Trovato, bug3Trovato]);

    useEffect(() => {
        if (score === 100 && user) {
            addUser();
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
        <div className="bg-blue-100 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="bg-purple-600 py-4 px-6"> {/* Intestazione viola */}
                        <h2 className="mt-2 text-center text-xl font-semibold tracking-tight text-white">Mini Calcolatrice</h2>
            </div>

                {/* Score Bar */}
                <div className="mt-4 mb-6">
                    <div className="bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: `${score}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center mt-2">{score}% Completato</p>
                </div>

                <form onSubmit={calcola} className="space-y-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setRisultato(null);
                        }}
                        placeholder="Scrivi un'espressione (es: 3+5)"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500
                            ${errore
                                ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-red-500'
                                : 'border-gray-300'
                            }`}
                        disabled={errore}
                    />
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-200
                            ${errore
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                        disabled={errore}
                    >
                        Calcola
                    </button>
                </form>

                {errore && (
          <div className="mt-6 p-4 bg-purple-100 border bg-purple-400 bg-purple-00 rounded relative">
            <strong>Errore:</strong> {messaggioErrore}
            <button
              onClick={resettaErrore}
              className="absolute top-2 right-2 text-purple-800 font-bold hover:text-red-900"
            >
              &times;
            </button>
          </div>
        )}

                {risultato !== null && !errore && (
                    <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center gap-2">
                       
                        <p className="text-lg font-semibold">Risultato: {risultato}</p>
                    </div>
                )}

                {modalVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                            <h3 className="text-2xl font-semibold text-center mb-4 text-purple-600">
                                Ottimo lavoro!
                            </h3>
                            <p className="text-center mb-6 text-gray-700">Hai trovato tutti i bug! Puoi passare al prossimo gruppo di test!</p>
                            <div className="text-center">
                                <button
                                    onClick={closeModal}
                                    className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition duration-200 font-semibold"
                                >
                                    Ok, torna alla Home
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestTextBox;
