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
  let count = JSON.parse(sessionStorage.getItem("products") || "[]").length;
  const { user } = UserAuth();
  
  const handleFirstClick = (titleP, priceP, photoP) => {

    isSleeping.current = true;
    secondClickedDuringSleep.current = false;
    productToSave.current = { title: titleP, price: priceP, photo: photoP }; // Memorizza il prodotto

    setTimeout(() => {
      if (!secondClickedDuringSleep.current) {
        sessionStorage.setItem("count", count + 1);
        saveProduct(productToSave.current.title, productToSave.current.price, productToSave.current.photo);
        isSleeping.current = false;
      } else {
        // Se il secondo click è avvenuto, la navigazione e l'incremento sono già stati gestiti
        secondClickedDuringSleep.current = false;
        isSleeping.current = false;
      }
    }, 8000);
  };

  const handleSecondClick = () => {
    if (isSleeping.current) {
      secondClickedDuringSleep.current = true;
      sessionStorage.setItem("count", count + 1);
      navigate("/cart");
      productToSave.current = null; // Annulla il salvataggio se si clicca "Carrello" durante lo sleep
    }
    else {
      navigate("/cart");
    }
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
    let count = JSON.parse(sessionStorage.getItem("products") || "[]").length;
    sessionStorage.setItem("count", count)
  }, []);
  
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
                <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("imacTitle", "imacPrice", "imacPhoto")}>
                  <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                  </svg>
                  Acquista
                </button>
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
                <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("matebookTitle", "matebookPrice", "matebookPhoto")}>
                  <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                  </svg>
                  Acquista
                </button>
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
                <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("watchTitle", "watchPrice", "watchPhoto")}>
                  <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                  </svg>
                  Acquista
                </button>
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
                <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("ipadTitle", "ipadPrice", "ipadPhoto")}>
                  <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                  </svg>
                  Acquista
                </button>
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
                <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("iphoneTitle", "iphonePrice", "iphonePhoto")}>
                  <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                  </svg>
                  Acquista
                </button>
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
                <button type="button" className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none active:bg-blue-800 active:shadow-inner" onClick={() => handleFirstClick("ps5Title", "ps5Price", "ps5Photo")}>
                  <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                  </svg>
                  Acquista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

};

export default Ecommerce;