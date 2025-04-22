import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { UserAuth } from "../context/AuthContext";
const TestTextBox = () => {
  const [input, setInput] = useState('');
  const [risultato, setRisultato] = useState(null);
  const [errore, setErrore] = useState(false);
  const [messsaggioErrore, setMessaggioErrore] = useState('');
  const [bug1, setBug1] = useState(false);
  const [bug2, setBug2] = useState(false);
  const [bug3, setBug3] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const { user} = UserAuth();
  const [score, setScore] = useState(0);
  /*const testFirestore = async () => {
    try {
      const testRef = doc(db, "TextBox", "testUser123"); // Usa un ID statico per test
      await setDoc(testRef, {
        id: "testUser123",
        percentage: "100",
        createdAt: serverTimestamp(),
      });
      console.log("Documento creato con successo!");
    } catch (error) {
      console.error("Errore Firestore:", error);
    }
  };*/
  
  async function addUser() {

    const userRef = doc(db, "TextBox", user.uid); 
    
    try {
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        // Utente già esistente: aggiorna solo score e lastUpdate
        await setDoc(userRef, {
          percentage: String(score),
          lastUpdate: serverTimestamp(),
        }, { merge: true });
  
        console.log("Utente aggiornato con nuovo score e timestamp.");
      } else {
        // Nuovo utente: crea con tutti i campi
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
      if (/[a-zA-Z]/.test(input) && !bug1) {
        setBug1(true);
        setErrore(true);
        setMessaggioErrore("L'espressione contiene lettere! Hai trovato un bug!");
      } else if (/[#]/.test(input) && !bug2) {
        setBug2(true);
        setErrore(true);
        setMessaggioErrore("L'espressione contiene #! Hai trovato un bug!");
      } else if (input === "" && !bug3) {
        setBug3(true);
        setErrore(true);
        setMessaggioErrore("L'espressione è vuota! Hai trovato un bug!");
      } else if (/[a-zA-Z]/.test(input) && bug1) {
        setErrore(true);
        setMessaggioErrore("Hai già trovato il bug delle lettere!");
      } else if (/#/.test(input) && bug2) {
        setErrore(true);
        setMessaggioErrore("Hai già trovato il bug dell'hashtag!");
      } else if (input === "" && bug3) {
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
    if (bug1 && bug2 && bug3 && user) {
      const finalScore = 100; // → 100
      setScore(finalScore);
      console.log("User:", user); // aggiorna lo stato
    }
  }, [bug1, bug2, bug3, user]); // Aggiunto `user` nelle dipendenze
  
  useEffect(() => {
    if (score == 100 && user) {
      addUser(); // ora score ha il valore giusto
      //testFirestore();
      //console.log("db:", db);
      //testFirestore();
      setModalVisible(true); // mostra il modal qui
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Mini Calcolatrice</h2>
      <form onSubmit={calcola} className="flex flex-col gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un'espressione (es: 3+5)"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={errore}
        />
        <button
          type="submit"
          className={`p-2 rounded text-white font-semibold ${errore ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={errore}
        >
          Calcola
        </button>
      </form>

      {errore && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
          <strong>Errore:</strong> {messsaggioErrore}
          <button
            onClick={resettaErrore}
            className="absolute top-1 right-2 text-red-700 font-bold hover:text-red-900"
          >
            &times;
          </button>
        </div>
      )}

      {risultato !== null && !errore && (
        <p className="mt-4 text-green-700 text-lg font-semibold">
          Risultato: {risultato}
        </p>
      )}

      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-center mb-4">Ottimo lavoro!</h3>
            <p className="text-center mb-4">Hai trovato tutti i bug! Puoi passare al prossimo gruppo di test!</p>
            <div className="text-center">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ok, torna alla Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestTextBox;
