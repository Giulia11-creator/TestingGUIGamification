import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popUpErrore, setpopUpErrore] = useState(false);
  const [messaggioErrore, setMessaggioErrore] = useState("");
  const [bugData, setbugData] = useState(false);
  const [bugColonnaVuota, setbugColonnaVuota] = useState(false);
  const [score, setscore] = useState(false);
  const navigate = useNavigate();
  const { user } = UserAuth();

  async function addUser() {
    const userRef = doc(db, "Todo", user.uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        await setDoc(
          userRef,
          {
            percentage: String(score),
            lastUpdate: serverTimestamp(),
          },
          { merge: true }
        );
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

  const addTodo = () => {
    if (!text.trim()) return;
    const nuovoTodo = { text: text, dueDate: new Date() };
    if ((todos.length + 1) % 3 === 0 && todos.length > 0) {
      const giorniNelPassato = Math.floor(Math.random() * 30) + 1;
      const dataPassata = new Date();
      dataPassata.setDate(dataPassata.getDate() - giorniNelPassato);
      nuovoTodo.dueDate = dataPassata;
    }
    setTodos([...todos, nuovoTodo]);
    setText("");
    setShowPopup(false);
  };

  const removeAll = () => {
    if (todos.length === 0 && !bugColonnaVuota) {
      setpopUpErrore(true);
      setMessaggioErrore(
        "Hai trovato un bug!!! Il pulsante cancella tutto è abilitato anche se non ci sono task!"
      );
      setbugColonnaVuota(true);
    } else {
      setTodos([]);
    }
  };

  const resettaErrore = () => {
    setpopUpErrore(false);
    setMessaggioErrore("");
  };

  const gestisciClickData = (todo) => {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    const dataTodo = new Date(todo.dueDate);
    dataTodo.setHours(0, 0, 0, 0);

    if (dataTodo < oggi && !bugData) {
      setMessaggioErrore(`Hai trovato un bug!!! la data del task è sbagliata`);
      setpopUpErrore(true);
      setbugData(true);
    } else {
      setMessaggioErrore("questo bug è già stato trovato!!! Cerca ancora");
      setpopUpErrore(true);
    }
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let currentScore = 0;
    if (bugColonnaVuota) currentScore += 50;
    if (bugData) currentScore += 50;
    setscore(currentScore);
  }, [bugColonnaVuota, bugData]);

  useEffect(() => {
    if (user) {
      addUser();
    }
  }, [score, user]);

  return (
    <div className="bg-blue-100 overflow-hidden h-screen flex flex-col">
      <nav className="bg-white p-4 flex justify-between items-center shadow-md border-b-2 border-green-400 flex-shrink-0">
        <span className="text-xl text-gray-500">
          <span className="text-purple-800">{user && user.email.split('@')[0]}</span>
        </span>
        <div className="relative">
          <div className="bg-purple-200 rounded-full p-1">
            <FaUserCircle
              className="text-purple-800 text-3xl cursor-pointer"
              onClick={() => navigate("/account")}
            />
          </div>
        </div>
      </nav>
      <div className="bg-blue-100 p-8 grid grid-cols-3 gap-8 flex-grow overflow-y-auto">
        {/* Colonna sinistra (Popup Errore) */}
        <div className="flex items-start justify-center overflow-y-auto max-h-full">
          {popUpErrore && (
            <div className="bg-purple-100 border border-purple-400 rounded relative max-w-sm shadow-lg p-4">
              <strong className="block mb-1 text-purple-700">Errore:</strong>
              <p className="text-sm text-purple-800">{messaggioErrore}</p>
              <button
                onClick={resettaErrore}
                className="absolute top-2 right-2 text-purple-800 font-bold hover:text-red-900"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        {/* Colonna centrale (Lista dei Task) */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between overflow-y-auto max-h-full">
          <div>
            <h2 className="text-lg font-bold mb-4">📋 Task</h2>
            <div className="space-y-3">
              {todos.map((todo, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg flex justify-between items-center shadow-sm"
                >
                  <span>{todo.text}</span>
                  <span
                    className="text-gray-500 text-sm ml-2 cursor-pointer"
                    onClick={() => gestisciClickData(todo)}
                  >
                    {todo.dueDate ? todo.dueDate.toLocaleDateString() : ""}
                  </span>
                  <button
                    onClick={() => removeTodo(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 flex-shrink-0">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              onClick={() => setShowPopup(true)}
              disabled={popUpErrore}
            >
              Aggiungi
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              onClick={removeAll}
              disabled={popUpErrore}
            >
              Elimina tutto
            </button>
          </div>
        </div>

        {/* Colonna destra (Paragrafo) */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-start overflow-y-auto max-h-full">
          <p className="text-gray-700">Potrei mettere nome utente</p>
          <p className="text-gray-700">Score : {score}</p>
        </div>

        {/* Popup: Aggiunta Task */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Inserisci un'attività</h2>
              <input
                type="text"
                placeholder="Scrivi qui..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mb-4">
                <p>robaaaaa</p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Annulla
                </button>
                <button
                  onClick={addTodo}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Salva
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoList;