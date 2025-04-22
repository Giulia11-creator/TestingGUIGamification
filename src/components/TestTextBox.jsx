import React, {useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import {useNavigate} from 'react-router-dom';
//import {Link, useNavigate} from 'react-router-dom';
const TestTextBox = () => {
     const [input, setInput] = useState('');
     const [risultato, setRisultato] = useState(null);
     const [errore, setErrore] = useState(false);
     const [messsaggioErrore, setMessaggioErrore] = useState('');
     const {user} = UserAuth();
     const navigate = useNavigate();

     const calcola = (e) =>{
        e.preventDefault();

        try {
          if (/[a-zA-Z]/.test(input)) {
            throw new Error("L'espressione contiene lettere! Hai trovato un bug!");
          }

          const risultato = eval(input);
          setRisultato(risultato);
          setErrore (false);
          setMessaggioErrore('');

       
     }catch(error){
        setErrore(true);
        setMessaggioErrore(error.message);
        setRisultato(null);
     }
    }

    const resettaErrore = () => {
        setErrore(false);
        setMessaggioErrore('');
        setInput('');
    };
    
     const handleHome = () => { // Questo è corretto
        try {
          navigate('/account');
        } catch (e) {
          console.log(e.message);
        }
      
    }
     useEffect(() => {
            
          }, []);
        
          return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
              <p>{user && user.email}</p>
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
            <button onClick={handleHome}>account</button>
            </div>
          );
         
}


export default TestTextBox;