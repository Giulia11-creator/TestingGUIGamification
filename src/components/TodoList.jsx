import React, { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popUpErrore, setpopUpErrore] = useState(false);
  const [messaggioErrore, setMessaggioErrore] = useState("");

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos([...todos, text.trim()]);
    setText('');
    setShowPopup(false);
  };

  const removeAll = () => {
    if (todos.length === 0) {
      setpopUpErrore(true);
      setMessaggioErrore("Hai trovato un bug!!! Il pulsante cancella tutto è abilitato anche se non ci sono task!");
    } else {
      setTodos([]);
    }
  };

  const resettaErrore = () => {
    setpopUpErrore(false);
    setMessaggioErrore("");
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen bg-blue-100 p-8">
      {/* Colonna sinistra */}
      <div className="w-80 bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-4">📋 Task</h2>
          <div className="space-y-3">
            {todos.map((todo, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg flex justify-between items-center shadow-sm">
                <span>{todo}</span>
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

        {/* Bottoni in fondo alla colonna */}
        <div className="mt-6 grid grid-cols-2 gap-2">
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

      {/* Popup: Aggiunta Task */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Inserisci un'attività</h2>

            <input
              type="text"
              placeholder="Scrivi qui..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mb-4">
              <label className="mr-4">
                <input type="radio" name="priorità" value="alta" className="mr-1" />
                Alta
              </label>
              <label>
                <input type="radio" name="priorità" value="bassa" className="mr-1" />
                Bassa
              </label>
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

      {/* Popup errore */}
      {popUpErrore && (
        <div className="fixed bottom-6 right-6 p-4 bg-purple-100 border border-purple-400 rounded relative max-w-sm shadow-lg">
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
  );
}

export default TodoList;
