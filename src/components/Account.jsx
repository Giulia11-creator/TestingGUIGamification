import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CircularButton from "./CircularButton";
import { db } from '../firebase';
import { doc, getDoc} from "firebase/firestore";
import { FaUserCircle } from "react-icons/fa";

const Account = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);
  const [progress4, setProgress4] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.log(e.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchUserScoreTextBox = async () => {
    try {
      const docRef = doc(db, "TextBox", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProgress1(docSnap.data()?.percentage);
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
        setProgress1(docSnap.data()?.percentage);
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
        setProgress1(docSnap.data()?.percentage);
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
        setProgress1(docSnap.data()?.percentage);
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
      handleSearchUserScoreTextBox();
    }, 500);
  }, []);

  return (
    <div
      style={{
        height: "auto",
        width: "auto",
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f5",
        overflow: "hidden",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      {/* NUOVA NAVBAR */}
      <nav
        style={{
          
          backgroundColor: "white",
          padding: "10px 15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          borderBottom: "2px solid #81c784",
        }}
      >
       <span style={{ color: "#555", fontSize: "20px" }}>
  <strong>Bentornato</strong>, <span style={{ color: "#4B0082" }}>{user && user.email.split('@')[0]}</span>! Pronto per una nuova sfida? 💪
</span>
        <div style={{ position: "relative" }}>
        <div style={{  backgroundColor: "#e0bbed", borderRadius: "50%", padding: "5px" }}> {/* Contenitore per l'icona */}
            <FaUserCircle
              style={{ fontSize: "28px", cursor: "pointer", fill: "#4B0082" }}
              onClick={toggleMenu}
            />
        </div>
          {isMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "white",
                borderRadius: "4px",
                marginTop: "5px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                zIndex: 10,
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "transparent",
                  color: "#4B0082",
                  border: "none",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  textAlign: "left",
                  display: "block",
                  transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out", // Aggiunta transizione
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#E0BBE4"; // Tono di viola più chiaro
                  e.target.style.color = "#33003D"; // Tono di viola più scuro per il testo
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#4B0082";
                }}
              >
                Logout
              </button>
              {/* Altre opzioni del menu utente potrebbero andare qui */}
            </div>
          )}
        </div>
      </nav>

      {/* CONTENUTO */}
      <main
        style={{
      flexGrow: 1,
      height: "auto",
      width: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e0f2f7",
      padding: "60px",
      overflowX: "hidden",
      overflowY: "hidden",
        }}
      >
        {/* Griglia dei pulsanti */}
        <div
          style={{
            height:"auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "40px",
            
          }}
        >
          <CircularButton
            percentage={progress1}
            label="Text Box Testing"
            onClick={handleButton1}
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