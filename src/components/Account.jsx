import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { FaUserCircle } from "react-icons/fa";

const Account = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [progress1, setProgress1] = useState(0); // Inizializzato a 0
  const [progress2, setProgress2] = useState(0); // Inizializzato a 0
  const [progress3, setProgress3] = useState(0); // Inizializzato a 0
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Funzione per il logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.log(e.message);
    }
  };

  // Toggle del menu utente
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Funzione per ottenere il punteggio dal DB
  const handleSearchUserScore = async (raccolta) => {
    try {
      
      const docRef = doc(db, raccolta, user.uid); // Usando l'uid per identificare il documento
      const docSnap = await getDoc(docRef); // Recupero del documento

      if (docSnap.exists()) {
      if(raccolta=="TextBox")
        setProgress1(docSnap.data()?.percentage);
      if(raccolta=="Todo")
        setProgress3(docSnap.data()?.percentage);
      if(raccolta=="Ecommerce")
        setProgress2(docSnap.data()?.percentage); // Imposto il punteggio di progress1
      } else {
        console.log("Il documento non esiste!");
      }
    } catch (e) {
      console.log("Errore nel recupero del documento: " + e.message);
    }
  };


  // Recupero dei dati dal DB al caricamento della pagina
  useEffect(() => {
    handleSearchUserScore("TextBox"); 
    handleSearchUserScore("Ecommerce"); 
    handleSearchUserScore("Todo"); 
  }, []); // Questo useEffect si attiva solo una volta al caricamento del componente

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col overflow-hidden">
      <nav className="bg-white p-4 flex justify-between items-center shadow-md border-b-2 border-green-400 flex-shrink-0">
        <span className="text-xl text-gray-500">
          <strong>Bentornato</strong>, <span className="text-purple-800">{user && user.email.split('@')[0]}</span>! Pronto per una nuova sfida? 💪
        </span>
        <div className="relative">
          <div className="bg-purple-200 rounded-full p-1">
            <FaUserCircle
              className="text-purple-800 text-3xl cursor-pointer"
              onClick={toggleMenu}
            />
          </div>
          {isMenuOpen && (
            <div className="absolute top-full right-0 bg-white rounded-md mt-2 shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-purple-800 hover:bg-purple-200 hover:text-purple-900 focus:outline-none"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex justify-center items-center bg-blue-100 py-10 px-4 overflow-auto">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full flex flex-col justify-between">
            <div>
              <div className="bg-purple-600 text-white py-4 px-6 flex items-center">
                <h2 className="text-xl font-semibold">Testing</h2>
              </div>
              <div className="p-4 sm:p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Benvenuto!</h3>
                  <p className="text-sm text-gray-600">Completa i test per imparare qualcosa sul mondo del Testing.</p>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-4">Test</h4>
                  <ul className="space-y-4">
                    {/* Test 1 */}
                    <li className="bg-gray-50 rounded-md py-3 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center">
                        <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3" />
                        <span>Test TextBox</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-500 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${progress1}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{progress1}%</span>
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded"
                          onClick={() => navigate("/textbox")}
                        >
                          Inizia il Test
                        </button>
                      </div>
                    </li>

                    {/* Test 2 */}
                    <li className="bg-gray-50 rounded-md py-3 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-3" />
                        <span>Fleaky test</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${progress2}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{progress2}%</span>
                        <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded"
                        onClick={() => navigate("/ecommerce")}
                        >
                          Inizia il Test
                        </button>
                      </div>
                    </li>

                    {/* Test 3 */}
                    <li className="bg-gray-50 rounded-md py-3 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center">
                        <div className="bg-red-100 text-red-700 rounded-full w-8 h-8 flex items-center justify-center mr-3" />
                        <span>Test 3</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-red-500 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${progress3}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{progress3}%</span>
                        <button 
                        className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded"
                        onClick={() => navigate("/todo")}>
                          Inizia il Test
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 py-3 px-6 text-gray-500 text-sm flex justify-between">
              <span>© 2024 Testing</span>
              <span>2024 Testing</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
