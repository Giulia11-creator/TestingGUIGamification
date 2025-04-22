import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CircularButton from "./CircularButton"; // Assicurati di importare CircularButton
import { db } from '../firebase';
import { doc, getDoc} from "firebase/firestore";
const Account = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);
  const [progress4, setProgress4] = useState(0);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSearchUserScoreTextBox = async () => {
    try {
      const docRef = doc(db, "TextBox", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProgress1(docSnap.data()?.percentage); // Accedi al campo desiderato con la dot notation
      } else {
        console.log("Il documento non esiste!");
        setProgress1(0);

      }
    } catch (e) {
      console.log("Errore nel recupero del documento: " + e.message);
    } 
  };
  const handleSearchUserScore2 = async () => {
    try {
      const docRef = doc(db, "TextBox", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProgress1(docSnap.data()?.percentage); // Accedi al campo desiderato con la dot notation
      } else {
        console.log("Il documento non esiste!");
        setProgress1(0);

      }
    } catch (e) {
      console.log("Errore nel recupero del documento: " + e.message);
    } 
  };
  const handleSearchUserScore3 = async () => {
    try {
      const docRef = doc(db, "TextBox", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProgress1(docSnap.data()?.percentage); // Accedi al campo desiderato con la dot notation
      } else {
        console.log("Il documento non esiste!");
        setProgress1(0);

      }
    } catch (e) {
      console.log("Errore nel recupero del documento: " + e.message);
    } 
  };
  const handleSearchUserScore4 = async () => {
    try {
      const docRef = doc(db, "TextBox", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProgress1(docSnap.data()?.percentage); // Accedi al campo desiderato con la dot notation
      } else {
        console.log("Il documento non esiste!");
        setProgress1(0);

      }
    } catch (e) {
      console.log("Errore nel recupero del documento: " + e.message);
    } 
  };

  const handleButton1 = () => {
    try {
      navigate("/textbox");
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    // Simulazione fetch da DB o file
    setTimeout(() => {
      //setProgress1(25);
      //setProgress2(50);
      //setProgress3(75);
      //setProgress4(80);
      handleSearchUserScoreTextBox();
    }, 500);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "#1e1e1e",
        overflow: "hidden",
      }}
    >
      {/* NAVBAR SEMANTICA */}
      <nav
        style={{
          backgroundColor: "#333",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "white", fontSize: "20px" }}>🚀 Ciao, {user && user.email}</span>
        <button
          style={{
            backgroundColor: "#FF5733",
            color: "white",
            border: "none",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "16px",
            borderRadius: "4px",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      {/* CONTENUTO */}
      <main
        style={{
          flexGrow: 1,
          display: "flex", // layout flex
          justifyContent: "center", // centra orizzontalmente
          alignItems: "center", // centra verticalmente
          background: "#f5f5f5",
          padding: "40px",
          overflow: "hidden",
        }}
      >
        {/* Griglia dei pulsanti */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 2 colonne fisse
            gridTemplateRows: "repeat(2, 1fr)", // 2 righe fisse
            gap: "40px",
          }}
        >
          <CircularButton
            percentage={progress1}
            label="Text Box Testing"
            onClick={handleButton1} // Passiamo la funzione handleButton1
          />
          <CircularButton percentage={progress2} label="Pulsante 2" />
          <CircularButton percentage={progress3} label="Pulsante 3" />
          <CircularButton percentage={progress4} label="Pulsante 4" />
        </div>
      </main>
    </div>
  );
};

export default Account;
