import React, { useState, useEffect,useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { addUser } from "./FirestoreFunction.js";
import EndTimer from "./EndTimer.jsx";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popUpErrore, setpopUpErrore] = useState(false);
  const [messaggioErrore, setMessaggioErrore] = useState("");
  const [bugData, setbugData] = useState(false);
  const [bugColonnaVuota, setbugColonnaVuota] = useState(false);
  const [bugTroppiTask, setbugTroppiTask] = useState(false);
  const [score, setscore] = useState(0);
  const [showModal, setshowModal] = useState(false);
  const [showFaccine, setShowFaccine] = useState(false);
  const navigate = useNavigate();
  const { user } = UserAuth();
  const DURATION = 20 * 60;
    const [seconds, setseconds] = useState(() => {
      const saved = sessionStorage.getItem("timer");
      return saved ? Number(saved) : DURATION;
    });
    const [finishedTime, setFinishedTimer] = useState(false);
useEffect(() => {
    if (seconds <= 0) {
      setFinishedTimer(true);
      return;
    }

    const id = setInterval(() => {
      setseconds((prev) => {
        const next = prev - 1;
        sessionStorage.setItem("timer", next);
        return next;
      });

    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const elapsed = DURATION - seconds;
  const formatTime = useCallback(() => {
    const minutes = Math.floor(elapsed / 60);
    const Seconds = elapsed % 60;
    return `${String(minutes).padStart(2, "0")}:${String(Seconds).padStart(2, "0")}`;
  }, [elapsed]);

  const CloseModal = () => {
    setshowModal(false);
    navigate("/account");
  };

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
      setMessaggioErrore("🧹 Ben fatto! Hai individuato un bug di validazione UI (interfaccia utente). Il pulsante “Elimina tutto” resta cliccabile anche quando non ci sono task, permettendo un’azione senza senso. Si tratta di un errore di validazione dello stato: l’app non controlla che la lista sia vuota prima di abilitare l’azione. Questo tipo di bug compromette la coerenza dell’interfaccia e può confondere l’utente.");
      setbugColonnaVuota(true);
    } else {
      setTodos([]);
    }
  };

  const resettaErrore = () => {
    setpopUpErrore(false);
    setMessaggioErrore("");
    if (bugTroppiTask) {
      setTodos([]);
      setShowFaccine(false);
    }
  };

  const gestisciClickData = (todo) => {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const dataTodo = new Date(todo.dueDate);
    dataTodo.setHours(0, 0, 0, 0);

    if (dataTodo < oggi && !bugData) {
      setMessaggioErrore("🎉 Congratulazioni! Hai scoperto un bug logico. Ogni volta che aggiungi tre task, il terzo viene salvato con una data sbagliata. In pratica, l’applicazione sovrascrive la data in modo errato invece di usare quella scelta dall’utente. Questo è un esempio tipico di bug logico (off-by-one), in cui la logica del programma produce un comportamento non coerente con l’intenzione.");
      setpopUpErrore(true);
      setbugData(true);
    } else {
      setMessaggioErrore("Questo bug è già stato trovato!!! Cerca ancora");
      setpopUpErrore(true);
    }
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let currentScore = 0;
    if (bugColonnaVuota) currentScore += 33;
    if (bugData) currentScore += 33;
    if (bugTroppiTask) currentScore += 34;
    setscore(currentScore);
  }, [bugColonnaVuota, bugData, bugTroppiTask]);

  useEffect(() => {
    if (score === 100) {
      setshowModal(true);
    }
  }, [score]);

  useEffect(() => {
    (async () => {
      if (user) {
        await addUser("Todo", user.uid, { score, email: user.email,time:formatTime() });
      }
    })();
  }, [score, user,formatTime]);

  useEffect(() => {
    if (todos.length >= 7) {
      if (!bugTroppiTask) {
        setMessaggioErrore("🌀 Ottimo lavoro! Hai trovato un bug prestazionale. Dopo aver aggiunto molti task, l’app inizia a rallentare, bloccare o duplicare contenuti. Questo tipo di errore nasce da una gestione inefficiente dello stato o del rendering, dove l’interfaccia prova a mostrare troppi elementi contemporaneamente senza ottimizzazioni (come paginazione o virtualizzazione). È un bug di prestazioni e stabilità: non altera i dati in sé, ma degrada il comportamento dell’app quando viene stressata oltre i limiti previsti.");
        setbugTroppiTask(true);
      } else {
        setMessaggioErrore("Hai già trovato questo bug !!!");
      }
      setpopUpErrore(true);
      setShowFaccine(true);
      setTodos([]);
    }
  }, [todos, bugTroppiTask]);

  return (
    <div className="bg-slate-50 overflow-hidden min-h-screen flex flex-col">
      {/* Topbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-purple-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-5 py-3 flex items-center justify-between">
          {/* Sinistra: saluto */}
          <span className="text-lg md:text-xl text-slate-600">
            <span className="text-purple-800 font-semibold">
              Ciao, {user?.email?.split('@')[0] || 'utente'}
            </span>
             <h2>
              Timer: {minutes}:{remainingSeconds.toString().padStart(2, "0")}
            </h2>
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

      {/* Modale completamento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center">
            <h3 className="text-2xl font-semibold mb-3 text-purple-700">
              Ottimo lavoro!
            </h3>
            <p className="mb-6 text-slate-700">
              Hai trovato tutti i bug! Puoi passare al prossimo gruppo di test!
            </p>
            <button
              onClick={CloseModal}
              className="inline-flex items-center justify-center bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-semibold transition"
            >
              Ok, torna alla Home
            </button>
          </div>
        </div>
      )}
      {finishedTime && (<EndTimer/>)}

      {/* Contenuto */}
      <div className="flex-grow">
        <div className="max-w-[1200px] mx-auto px-5 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonna sinistra (Popup Errore) */}
            <div className="flex items-start justify-center">
              {popUpErrore && (
                <div className="relative w-full max-w-sm bg-red-50 border border-red-300 text-red-800 rounded-xl shadow-md p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <strong className="block mb-1">Errore</strong>
                      <p className="text-sm leading-5">{messaggioErrore}</p>
                    </div>
                  </div>
                  <button
                    onClick={resettaErrore}
                    className="absolute top-2 right-2 text-red-700 hover:text-red-900 font-bold"
                    aria-label="Chiudi avviso"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            {/* Colonna centrale (Lista dei Task) */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">📋 Task</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">
                  {todos.length} attivi
                </span>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {todos.length > 0 && todos.length < 7 ? (
                  todos.map((todo, index) => (
                    <div
                      key={index}
                      className="group bg-slate-100/80 hover:bg-slate-100 transition-colors p-3 rounded-xl flex items-center gap-3 shadow-sm"
                    >
                      <span className="flex-1 text-slate-800">{todo.text}</span>

                      <button
                        className="text-xs text-slate-500 hover:text-purple-700 bg-white border border-slate-200 rounded-lg px-2 py-1 transition"
                        onClick={() => gestisciClickData(todo)}
                        title="Data scadenza"
                      >
                        {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "Data"}
                      </button>

                      <button
                        onClick={() => removeTodo(index)}
                        className="shrink-0 inline-flex items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 px-2 py-1 text-sm transition"
                        aria-label="Rimuovi task"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  showFaccine && (
                    <div className="text-2xl mt-2 leading-6 break-words">
                      {"😱".repeat(300)}
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  className="bg-green-500 text-white px-4 py-2.5 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 font-semibold transition disabled:opacity-50"
                  onClick={() => setShowPopup(true)}
                  disabled={popUpErrore}
                >
                  Aggiungi
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-semibold transition disabled:opacity-50"
                  onClick={removeAll}
                  disabled={popUpErrore}
                >
                  Elimina tutto
                </button>
              </div>
            </div>

            {/* Colonna destra (Punti e Bug) */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-5">
              <h3 className="text-lg font-semibold text-slate-900">Punti</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-purple-700 tabular-nums">
                  {score}
                </span>
                <span className="text-sm text-slate-500">/ 100</span>
              </div>

              {/* Barra progresso */}
              <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full transition-all"
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-700">Bug trovati</p>
                <div className="text-2xl mt-1">
                  {"🪲".repeat(Math.floor(score / 30)) || "💤"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup: Aggiunta Task */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-slate-900">Inserisci un'attività</h2>

            <input
              type="text"
              placeholder="Scrivi qui..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-4 focus:ring-purple-200"
            />

            <p className="text-sm text-slate-500 mb-5">
              Inserisci la descrizione del tuo task.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-300 transition"
              >
                Annulla
              </button>
              <button
                onClick={addTodo}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-semibold transition"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default TodoList;
