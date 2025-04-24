import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularButton = ({ percentage, label, onClick, color = "#66bb6a", textColor = "white" }) => {
  const buttonSize = 90; // Definisci una dimensione fissa per il pulsante interno

  return (
    <div style={{ position: "relative", width: 200, height: 200, marginBottom: 40 }}>
      <CircularProgressbar
        value={percentage}
        // text={`${percentage}%`} // Rimossa la percentuale
        strokeWidth={12}
        styles={{
          path: {
            stroke: color,
            strokeLinecap: "round",
          },
          trail: {
            stroke: "#e0e0e0",
          },
          text: {
            fill: color,
            fontSize: "24px",
            fontWeight: "bold",
          },
        }}
      />
      <button
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${buttonSize}px`, // Imposta la larghezza fissa
          height: `${buttonSize}px`, // Imposta l'altezza fissa
          padding: 0, // Rimuovi il padding per controllare le dimensioni
          borderRadius: "10px",
          backgroundColor: color,
          color: textColor,
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          fontFamily:"sans-serif", // Aggiunto grassetto per il testo del pulsante
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "3px 3px 8px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translate(-50%, -50%) scale(1.05)";
          e.target.style.boxShadow = "4px 4px 10px rgba(0, 0, 0, 0.3)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translate(-50%, -50%) scale(1)";
          e.target.style.boxShadow = "3px 3px 8px rgba(0, 0, 0, 0.2)";
        }}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default CircularButton;