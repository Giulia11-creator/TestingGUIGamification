import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { UserAuth } from "../context/AuthContext";
import { useRef } from "react";
import { FaUserCircle } from 'react-icons/fa';

const Ecommerce = () => {
  const navigate = useNavigate();
  const secondClickedDuringSleep = useRef(false);
  const isSleeping = useRef(false);
  const productToSave = useRef(null); // Ref per memorizzare il prodotto da salvare
  let length = JSON.parse(sessionStorage.getItem("products") || "[]").length;
  const [bugEmptyList, setbugEmptyList] = useState(() => {
    const saved = sessionStorage.getItem('bugEmptyList');
    return saved ? JSON.parse(saved) : false;
  });
  const [messaggioErrore, setmessaggioErrore] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [popVisible, setpopVisible] = useState(false);
  const [bugNoObject, setbugNoObject] = useState(() => {
    const saved = sessionStorage.getItem('bugNoObject');
    return saved ? JSON.parse(saved) : false;
  });
  const [score, setscore] = useState(() => {
    const saved = sessionStorage.getItem('score');
    return saved ? JSON.parse(saved) : 0;
  });
  const { user } = UserAuth();
  // Questo effetto scatta ogni volta che cambiano i bug
  useEffect(() => {
    // Controllo e setto score la prima volta per bugEmptyList
    if (bugEmptyList) {
      const scoreSetForBugEmptyList = sessionStorage.getItem('scoreSetForBugEmptyList');
      if (!scoreSetForBugEmptyList) {
        const newScore = score + 33; // il valore che vuoi settare
        setscore(newScore);
        sessionStorage.setItem('score', JSON.stringify(newScore));
        sessionStorage.setItem('scoreSetForBugEmptyList', 'true');
      }
    }
  }, [bugEmptyList]);

  useEffect(() => {
    // Controllo e setto score la prima volta per bugNoObject
    if (bugNoObject) {
      const scoreSetForBugNoObject = sessionStorage.getItem('scoreSetForBugNoObject');
      if (!scoreSetForBugNoObject) {
        const newScore = score + 33; // il valore che vuoi settare
        setscore(newScore);
        sessionStorage.setItem('score', JSON.stringify(newScore));
        sessionStorage.setItem('scoreSetForBugNoObject', 'true');
      }
    }
  }, [bugNoObject]);

  // Quando lo score cambia, salvo sempre in sessionStorage
  useEffect(() => {
    sessionStorage.setItem('score', JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    if (score == 100) {
      setModalVisible(true);
    }
  }, [score]);

  async function addUser() {
    const userRef = doc(db, "Ecommerce", user.uid);
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
  useEffect(() => {
    if (user) {
      addUser();
    }
  }, [score, user]);

  const handleFirstClick = (titleP, priceP, photoP) => {

    isSleeping.current = true;
    secondClickedDuringSleep.current = false;
    productToSave.current = { title: titleP, price: priceP, photo: photoP }; // Memorizza il prodotto

    setTimeout(() => {
      if (!secondClickedDuringSleep.current) {
        sessionStorage.setItem("count", length + 1);
        saveProduct(productToSave.current.title, productToSave.current.price, productToSave.current.photo);
        isSleeping.current = false;
      } else {
        // Se il secondo click è avvenuto, la navigazione e l'incremento sono già stati gestiti
        secondClickedDuringSleep.current = false;
        isSleeping.current = false;
      }
    }, 4000);
  };

  const RemoveItem = (title, price, photo) => {
    const rawProducts = sessionStorage.getItem("products");
    const listProduct = rawProducts ? JSON.parse(rawProducts) : [];

    if (length === 0 && !bugEmptyList) {
      setmessaggioErrore("Hai trovato un bug! L'applicazione lascia rimuovere un prodotto anche se il carrello è vuoto!");
      setpopVisible(true);
      setbugEmptyList(true);
      sessionStorage.setItem('bugEmptyList', JSON.stringify(true));
      return;
    }

    if (length === 0 && bugEmptyList) {
      setmessaggioErrore("Hai trovato questo bug! L'applicazione lascia eliminare un prodotto prima che venga inserito!");
      setpopVisible(true);
      return;
    }

    const trovato = listProduct.some(
      (product) =>
        product.title === title &&
        product.price === price &&
        product.photo === photo
    );

    if (!trovato && !bugNoObject) {
      setmessaggioErrore("Hai trovato un bug! L'applicazione lascia eliminare un prodotto prima che venga inserito!");
      setpopVisible(true);
      setbugNoObject(true);
      sessionStorage.setItem('bugNoObject', JSON.stringify(true));
      return;
    }

    if (!trovato && bugNoObject) {
      setmessaggioErrore("Hai trovato questo bug! L'applicazione lascia eliminare un prodotto prima che venga inserito!");
      setpopVisible(true);
      return;
    }

    // Se il prodotto esiste, rimuovi solo la prima istanza che combacia esattamente
    const listProduct2 = [...listProduct];
    const index = listProduct2.findIndex(
      (product) =>
        product.title === title &&
        product.price === price &&
        product.photo === photo
    );

    if (index !== -1) {
      listProduct2.splice(index, 1);
      sessionStorage.setItem("products", JSON.stringify(listProduct2));
      sessionStorage.setItem("count", listProduct2.length);
    }
  };


  const handleSecondClick = () => {
    if (isSleeping.current) {
      secondClickedDuringSleep.current = true;
      sessionStorage.setItem("count", length + 1);
      navigate("/cart");
      productToSave.current = null; // Annulla il salvataggio se si clicca "Carrello" durante lo sleep
    }
    else {
      navigate("/cart");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigate("/account");
  };

  function saveProduct(title, price, photo) {
    const product = {
      title: document.getElementById(title).textContent,
      price: document.getElementById(price).textContent,
      photo: document.getElementById(photo).src
    };

    let products = sessionStorage.getItem("products");
    products = products ? JSON.parse(products) : [];

    products.push(product);

    sessionStorage.setItem("products", JSON.stringify(products));

    console.log("Prodotto salvato!");
  }
  useEffect(() => {
    let length = JSON.parse(sessionStorage.getItem("products") || "[]").length;
    sessionStorage.setItem("count", length)
  }, []);

  const resettaErrore = () => {
    setpopVisible(false);
    setmessaggioErrore('');
  };

  return (
    <section className="bg-blue-100 py-8 md:py-12 min-h-screen"> {/* Added min-h-screen for better layout */}

      <nav className="bg-white p-4 flex justify-between items-center shadow-md border-b-2 border-green-400">
        <span className="text-xl text-gray-500">
          <span className="text-purple-800">
            Ciao, {user?.email?.split('@')[0] || 'utente'}
          </span>
        </span>
        <div className="relative flex items-center"> {/* Added flex items-center for vertical alignment */}
          <div className="bg-purple-200 rounded-full p-1">
            <FaUserCircle
              className="text-purple-800 text-3xl cursor-pointer"
              onClick={() => navigate("/account")}
            />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 mt-8"> {/* Added mt-8 for spacing below nav */}
        <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">

          <div className="flex justify-between items-center p-4 bg-white shadow w-full">
            <h1 className="text-2xl font-bold text-gray-800">Negozio</h1> {/* Adjusted text color */}
            <div className="flex items-center space-x-4"> {/* Grouped emoji and button */}
              {'🪲'.repeat(Math.floor(score / 30))}
              <button
                onClick={handleSecondClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Carrello
              </button>
            </div>
          </div>

        </div>
        <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          {/* iMac Product Card */}
          <div className="rounded-lg border border-white-200 bg-white p-6 shadow-sm flex flex-col"> {/* Added flex-col for consistent card layout */}
            <div className="h-56 w-full flex items-center justify-center"> {/* Centered image vertically and horizontally */}
              <a href="#">
                {/* Removed 'hidden' and 'dark:block' as these are not relevant for a light background image */}
                <img id="imacPhoto" className="mx-auto h-full max-h-52 object-contain" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="Apple iMac" />
              </a>
            </div>
            <div className="pt-6 flex-grow flex flex-col justify-between"> {/* Flex-grow to make content fill space */}
              <div> {/* Grouped title and ratings */}
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center justify-end gap-1">
                    {/* Star ratings */}
                    <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                    <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                    <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1-4.2Z" /> {/* Adjusted path for a full star */}
                    </svg>
                    <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1-4.2Z" /> {/* Adjusted path for a full star */}
                    </svg>
                    <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                  </div>
                </div>
                <a href="#" id="imacTitle" className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">Apple iMac 27", 1TB HDD, Retina 5K Display, M3 Max</a>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {/* Stars - you have duplicates, consider mapping them if they are dynamic */}
                    {/* Keeping them as is for now, but a loop would be better */}
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">5.0</p>
                  <p className="text-sm font-medium text-gray-900">(455)</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p id="imacPrice" className="text-2xl font-extrabold leading-tight text-gray-900">$1699,00</p>
                <div className="flex flex-col space-y-4">
                  <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("imacTitle", "imacPrice", "imacPhoto")}>
                    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                    </svg>
                    Acquista
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner"
                    onClick={() => RemoveItem(
                      document.getElementById("imacTitle").textContent, // Ottiene il testo del titolo
                      document.getElementById("imacPrice").textContent, // Ottiene il testo del prezzo
                      document.getElementById("imacPhoto").src          // Ottiene la sorgente dell'immagine
                    )}
                  >
                    X Rimuovi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* HUAWEI MateBook Product Card */}
          <div className="rounded-lg border border-white-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="h-56 w-full flex items-center justify-center">
              <a href="#">
                <img id='matebookPhoto' className="mx-auto h-full max-h-52 object-contain" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-dark.svg" alt="HUAWEI MateBook X Pro" />
              </a>
            </div>
            <div className="pt-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center justify-end gap-1">
                  </div>
                </div>
                <a id='matebookTitle' href="#" className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">HUAWEI MateBook X Pro U7-155H 32GB +1TB Morandi Blue Windows 11 Pro</a>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">5.0</p>
                  <p className="text-sm font-medium text-gray-900">(1000)</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p id='matebookPrice' className="text-2xl font-extrabold leading-tight text-gray-900">$1400,00</p>
                <div className="flex flex-col space-y-4">
                  <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("matebookTitle", "matebookPrice", "matebookPhoto")}>

                    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                    </svg>
                    Acquista
                  </button>
                 <button
                    type="button"
                    className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner"
                    onClick={() => RemoveItem(
                      document.getElementById("matebookTitle").textContent, // Ottiene il testo del titolo
                      document.getElementById("matebookPrice").textContent, // Ottiene il testo del prezzo
                      document.getElementById("matebookPhoto").src          // Ottiene la sorgente dell'immagine
                    )}
                  >
                    X Rimuovi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Apple Watch Product Card */}
          <div className="rounded-lg border border-white-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="h-56 w-full flex items-center justify-center">
              <a href="#">
                <img id="watchPhoto" className="mx-auto h-full max-h-52 object-contain" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg" alt="Apple Watch Series 9" />
              </a>
            </div>
            <div className="pt-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center justify-end gap-1">
                  </div>
                </div>
                <a href="#" id="watchTitle" className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">Apple Watch Series 9 GPS 41mm Smartwatch con cassa in alluminio color mezzanotte e Cinturino Sport mezzanotte </a>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1-4.2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">5.0</p>
                  <p className="text-sm font-medium text-gray-900">(333)</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p id="watchPrice" className="text-2xl font-extrabold leading-tight text-gray-900">$500,00</p>
                <div className="flex flex-col space-y-4">
                  <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("watchTitle", "watchPrice", "watchPhoto")}>

                    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                    </svg>
                    Acquista
                  </button>
                 <button
                    type="button"
                    className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner"
                    onClick={() => RemoveItem(
                      document.getElementById("watchTitle").textContent, // Ottiene il testo del titolo
                      document.getElementById("watchPrice").textContent, // Ottiene il testo del prezzo
                      document.getElementById("watchPhoto").src          // Ottiene la sorgente dell'immagine
                    )}
                  >
                    X Rimuovi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Apple iPad Pro Product Card */}
          <div className="rounded-lg border border-white-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="h-56 w-full flex items-center justify-center">
              <a href="#">
                <img id="ipadPhoto" className="mx-auto h-full max-h-52 object-contain" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-keyboard-dark.svg" alt="Apple iPad Pro" />
              </a>
            </div>
            <div className="pt-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center justify-end gap-1">
                  </div>
                </div>
                <a href="#" id="ipadTitle" className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">Apple iPad Pro 11'': Chip M4 Progettato per Apple Intelligence, display Ultra Retina XDR, 256GB</a>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1-4.2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">5.0</p>
                  <p className="text-sm font-medium text-gray-900">(1355)</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p id="ipadPrice" className="text-2xl font-extrabold leading-tight text-gray-900">$1200,00</p>
                <div className="flex flex-col space-y-4">
                  <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("ipadTitle", "ipadPrice", "ipadPhoto")}>
                    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                    </svg>
                    Acquista
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner"
                    onClick={() => RemoveItem(
                      document.getElementById("ipadTitle").textContent, // Ottiene il testo del titolo
                      document.getElementById("ipadPrice").textContent, // Ottiene il testo del prezzo
                      document.getElementById("ipadPhoto").src          // Ottiene la sorgente dell'immagine
                    )}
                  >
                    X Rimuovi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Apple iPhone Product Card */}
          <div className="rounded-lg border border-white-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="h-56 w-full flex items-center justify-center">
              <a href="#">
                <img id="iphonePhoto" className="mx-auto h-full max-h-52 object-contain" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-dark.svg" alt="Apple iPhone 16" />
              </a>
            </div>
            <div className="pt-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center justify-end gap-1">
                  </div>
                </div>
                <a href="#" id="iphoneTitle" className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">Apple iPhone 16 128 GB: Telefono 5G con Controllo fotocamera, chip A18</a>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1-4.2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">5.0</p>
                  <p className="text-sm font-medium text-gray-900">(455)</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p id="iphonePrice" className="text-2xl font-extrabold leading-tight text-gray-900">$850,00</p>
                <div className="flex flex-col space-y-4">
                  <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("iphoneTitle", "iphonePrice", "iphonePhoto")}>
                    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                    </svg>
                    Acquista
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner"
                    onClick={() => RemoveItem(
                      document.getElementById("iphoneTitle").textContent, // Ottiene il testo del titolo
                      document.getElementById("iphonePrice").textContent, // Ottiene il testo del prezzo
                      document.getElementById("iphonePhoto").src          // Ottiene la sorgente dell'immagine
                    )}
                  >
                    X Rimuovi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Playstation 5 Product Card */}
          <div className="rounded-lg border border-white-200 bg-white p-6 shadow-sm flex flex-col">
            <div className="h-56 w-full flex items-center justify-center">
              <a href="#">
                <img id="ps5Photo" className="mx-auto h-full max-h-52 object-contain" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-dark.svg" alt="Playstation 5" />
              </a>
            </div>
            <div className="pt-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center justify-end gap-1">
                  </div>
                </div>
                <a href="#" id="ps5Title" className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">Playstation 5 Console Edizione Digital Slim</a>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1-4.2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-900">5.0</p>
                  <p className="text-sm font-medium text-gray-900">(455)</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p id="ps5Price" className="text-2xl font-extrabold leading-tight text-gray-900">$412,00</p>
                <div className="flex flex-col space-y-4">
                  <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("ps5Title", "ps5Price", "ps5Photo")}>
                    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                    </svg>
                    Acquista
                  </button>
                  { }
                  <button
                    type="button"
                    className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner"
                    onClick={() => RemoveItem(
                      document.getElementById("ps5Title").textContent, // Ottiene il testo del titolo
                      document.getElementById("ps5Price").textContent, // Ottiene il testo del prezzo
                      document.getElementById("ps5Photo").src          // Ottiene la sorgente dell'immagine
                    )}
                  >
                    X Rimuovi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {modalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <h3 className="text-2xl font-semibold text-center mb-4 text-purple-600">
                Ottimo lavoro!
              </h3>
              <p className="text-center mb-6 text-gray-700">Hai trovato tutti i bug! Puoi passare al prossimo gruppo di test!</p>
              <div className="text-center">
                <button
                  onClick={closeModal}
                  className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition duration-200 font-semibold"
                >
                  Ok, torna alla Home
                </button>
              </div>
            </div>
          </div>
        )}

        {popVisible && (
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
    </section>
  );

};

export default Ecommerce;