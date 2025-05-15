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

  const removeAll= () => {
    if(todos.length==0)
    {
        setpopUpErrore(true);
        setMessaggioErrore("Hai trivato un bug!!! il pulsante cancella tutto è abilitato anche se non ci sono task!")
    }
    else{
        setTodos([]);
    }

  };
  const resettaErrore= () => {
   setpopUpErrore(false);
   setMessaggioErrore("");

  };


  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="flex gap-4 p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Colonna pulsanti */}
      <div className="grid grid-cols-2 gap-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setShowPopup(true)}
          disabled={popUpErrore}
        >
          Aggiungi
        </button>
        
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"  onClick={removeAll} disabled={popUpErrore}>
          Elimina tutto
        </button>
      </div>

      {/* Testo fuori popup */}
      <div className="flex-1">
        <p className="text-gray-700">
          <ul>
            {todos.map((todo,index) => (
                <li key={index}>
                    {todo}{' '}
                     <button onClick={() => removeTodo(index)}>X</button>
 
                </li>
            ))}
          </ul>
        </p>
      </div>

      {/* Popup */}
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
      {popUpErrore && (
                        <div className="mt-6 p-4 bg-purple-100 border border-purple-400 rounded relative">
                            <strong>Errore:</strong> {messaggioErrore}
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
