import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularButton = ({ percentage, label, onClick }) => {
  return (
    <div style={{ position: "relative", width: 200, height: 200, marginBottom: 30 }}>
      <CircularProgressbar
        value={percentage} // Percentuale passata come prop
        text={`${percentage}%`} // Testo nel centro
        strokeWidth={10} // Larghezza del cerchio
        styles={{
          path: {
            stroke: "#4caf50", // Colore della barra di progresso
            strokeLinecap: "round",
          },
          trail: {
            stroke: "#d6d6d6", // Colore del percorso di sfondo
          },
          text: {
            fill: "#4caf50", // Colore del testo
            fontSize: "16px", // Dimensione del testo
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
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={onClick} // Gestore dell'evento onClick
      >
        {label} {/* Mostra l'etichetta del pulsante */}
      </button>
    </div>
  );
};

export default CircularButton;
