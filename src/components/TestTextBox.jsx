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
    <div className="bg-[#e0f2f7] min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">Mini Calcolatrice</h2>

        {/* Score Bar */}
        <div className="mb-4 bg-gray-200 rounded-full h-4 relative">
          <div
            className="bg-green-500 rounded-full h-4 absolute top-0 left-0"
            style={{ width: `${score}%` }}
          ></div>
          <span className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-sm text-gray-700">{score}%</span>
        </div>

        <form onSubmit={calcola} className="flex flex-col gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi un'espressione (es: 3+5)"
            className={`p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${errore ? 'bg-gray-200 cursor-not-allowed' : ''}`}
            disabled={errore}
          />
          <button
            type="submit"
            className={`p-3 rounded text-white font-semibold ${errore ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 transition duration-200'}`}
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
          <p className="mt-6 text-green-700 text-lg font-semibold text-center">
            Risultato: {risultato}
          </p>
        )}

        {modalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-semibold text-center mb-4 text-purple-700">Ottimo lavoro!</h3>
              <p className="text-center mb-6">Hai trovato tutti i bug! Puoi passare al prossimo gruppo di test!</p>
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