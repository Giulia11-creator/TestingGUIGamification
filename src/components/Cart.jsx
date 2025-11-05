import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { addUser } from "./FirestoreFunction.js";
import { UserAuth } from "../context/AuthContext";
import EndTimer from "./EndTimer.jsx";

// Util per i prezzi tipo "$1.699,00" -> 1699.00
function parsePrice(str) {
  if (!str) return 0;
  const cleaned = String(str)
    .replace(/[^0-9,.-]/g, "") // tieni solo cifre, separatori, segni
    .replace(/\./g, "")        // rimuovi separatori migliaia
    .replace(/,/g, ".");       // virgola -> punto
  const val = Number(cleaned);
  return Number.isFinite(val) ? val : 0;
}

const DURATION = 20 * 60;

const Cart = () => {
  const navigate = useNavigate();
  const { user } = UserAuth();

  const count = Number(sessionStorage.getItem("count"));
  const storedProducts = sessionStorage.getItem("products");
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  const length = Array.isArray(products) ? products.length : 0;

  // ✅ hooks now inside the component
  const [seconds, setseconds] = useState(() => {
    const saved = sessionStorage.getItem("timer");
    return saved ? Number(saved) : DURATION;
  });
  const [finishedTime, setFinishedTimer] = useState(false);

  const [bugFlaky, setbugFlaky] = useState(() => {
    const saved = sessionStorage.getItem('bugFlaky');
    return saved ? JSON.parse(saved) : false;
  });
  const [score, setscore] = useState(() => {
    const saved = sessionStorage.getItem('score');
    return saved ? JSON.parse(saved) : 0;
  });

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
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [elapsed]);

  // Persist/aggiorna punteggio su Firestore
  useEffect(() => {
    (async () => {
      if (user) {
        await addUser("Ecommerce", user.uid, { score, email: user.email, time: formatTime() });
      }
    })();
  }, [score, user, formatTime]);

  // Incrementa score la prima volta che rileviamo bugFlaky
  useEffect(() => {
    if (bugFlaky) {
      const flag = sessionStorage.getItem('scoreSetForbugFlaky');
      if (!flag) {
        const newScore = score + 34; // completa a 100 insieme agli altri +33 +33
        setscore(newScore);
        sessionStorage.setItem('score', JSON.stringify(newScore));
        sessionStorage.setItem('scoreSetForbugFlaky', 'true');
      }
    }
  }, [bugFlaky, score]);

  // Rileva il bug "flaky cart" quando il conteggio visuale > elementi effettivi
  useEffect(() => {
    if (count > length) {
      setbugFlaky(true);
      sessionStorage.setItem('bugFlaky', 'true');
    }
  }, [count, length]);

  const ClosePopUp = () => {
    navigate("/ecommerce");
  };

  const total = products.reduce((sum, p) => sum + parsePrice(p.price), 0);

  return (
    <section className="min-h-screen bg-slate-50 py-8 md:py-12 text-slate-800">
      <div className="mx-auto max-w-[1200px] px-5">
        {/* Header card */}
        <div className="w-full mb-6 md:mb-8 p-4 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Carrello</h1>
          <div className="flex items-center gap-3">
            <span aria-label="bug-score" className="text-2xl">
              {'🪲'.repeat(Math.floor(score / 30))}
            </span>
            {/* ✅ TIMER BADGE */}
            <div
              className={[
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold shadow-sm",
                "tabular-nums tracking-tight",
                seconds <= 30
                  ? "bg-red-100 text-red-700 ring-1 ring-red-200"
                  : seconds <= 60
                    ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                    : "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
                "ml-3 mt-1"   // ✅ aggiunto
              ].join(" ")}
              aria-live="polite"
              title="Tempo rimanente"
            >
              <span className="hidden sm:inline text-xs uppercase">Timer</span>
              <span className="font-mono text-base">
                {minutes}:{remainingSeconds.toString().padStart(2, "0")}
              </span>

              <span
                className={[
                  "ml-1 inline-block size-2 rounded-full",
                  seconds <= 30 ? "bg-red-500 animate-pulse" :
                    seconds <= 60 ? "bg-amber-500" : "bg-emerald-500",
                ].join(" ")}
                aria-hidden
              />
            </div>
            <button
              onClick={() => navigate('/ecommerce')}
              className="h-10 px-4 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 transition"
            >
              Torna al negozio
            </button>
          </div>
        </div>

        <div className="md:gap-6 lg:flex lg:items-start xl:gap-8">
          {/* Colonna sinistra: prodotti */}
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-4 md:p-6 shadow-[0_2px_6px_rgba(0,0,0,0.05)] border border-slate-200">
                {/* Popup bug flaky inline */}
                {count > length && (
                  <div className="mb-6">
                    <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-2xl text-center">
                      <h3 className="text-2xl font-semibold mb-3 text-purple-700">Ottimo lavoro!</h3>
                      <p className="mb-6 text-slate-700">
                        ⚡ Ottimo lavoro! Hai scoperto un flaky bug — un tipo di errore intermittente e dipendente dal tempo.
                        Succede quando aggiungi un prodotto e premi troppo in fretta il pulsante “Carrello”: il prodotto appena inserito non viene salvato e non compare nella lista.
                        Questo è un classico bug di concorrenza temporale (race condition): due operazioni (inserimento e navigazione) vengono eseguite troppo vicine nel tempo, e l’app non riesce a completare correttamente il salvataggio.
                        È un flaky bug, cioè un errore che non si manifesta sempre, ma solo in certe tempistiche o condizioni specifiche.
                        Questi bug sono tra i più difficili da trovare e da correggere, perché dipendono dalla velocità dell’utente o del dispositivo.
                      </p>
                      <button
                        onClick={ClosePopUp}
                        className="inline-flex items-center justify-center bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-semibold transition"
                      >
                        Ok, all&apos;ecommerce
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista prodotti */}
                {products.length === 0 ? (
                  <p className="text-slate-600">Il carrello è vuoto.</p>
                ) : (
                  products.map((product, index) => (
                    <ProductCard
                      key={index}
                      title={product.title}
                      price={product.price}
                      photo={product.photo}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Colonna destra: sommario */}
          <div className="mx-auto mt-6 max-w-4xl flex-1 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
              <p className="text-xl font-semibold text-slate-900">Sommario</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-slate-700">N. Prodotti</dt>
                    <dd className="text-base font-medium text-slate-900">{count}</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-slate-700">Totale</dt>
                    <dd className="text-base font-semibold text-emerald-600">
                      ${total.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 transition"
              >
                Checkout
              </button>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!bugFlaky) navigate('/ecommerce');
                  }}
                  disabled={bugFlaky}
                  className={`inline-flex items-center gap-2 text-sm font-medium underline ${bugFlaky
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-sky-700 hover:no-underline'
                    }`}
                  aria-disabled={bugFlaky}
                >
                  Continua lo shopping
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
        {finishedTime && (<EndTimer />)}
      </div>
    </section>
  );
};

export default Cart;
