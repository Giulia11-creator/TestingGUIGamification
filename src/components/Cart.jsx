import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { UserAuth } from "../context/AuthContext";

const Cart = () => {
  const count = Number(sessionStorage.getItem("count"));
  const storedProducts = sessionStorage.getItem("products");
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  const length = Array.isArray(products) ? products.length : 0;
  const navigate = useNavigate();
  let total = 0;
  const { user } = UserAuth();
  const [score, setscore] = useState(0);
  const [bugFlaky, setBugFlaky] = useState(false);

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

  useEffect(() => {
    let currentscore = 0
    if (bugFlaky) currentscore += 100;
    setscore(currentscore);
  }, [bugFlaky, score]);

  useEffect(() => {
    if (count > length)
      setBugFlaky(true);
  }, [bugFlaky]);

  const ClosePopUp = () => {
    navigate("/account");
  };

  return (
    <section className="bg-blue-100 py-8 antialiased  md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-black  sm:text-2xl">Carrello</h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <div
                className="rounded-lg bg-white p-4 shadow-sm  md:p-6">
                {count > length && (
                  <div className="flex justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                      <h3 className="text-2xl font-semibold text-center mb-4 text-purple-600">
                        Ottimo lavoro!
                      </h3>
                      <p className="text-center mb-6 text-gray-700">
                        Hai trovato il bug! Se si preme troppo rapidamente sul carrello il prodotto appena inserito non compare! Puoi passare al prossimo gruppo di test!
                      </p>
                      <div className="text-center">
                        <button
                          onClick={ClosePopUp}
                          className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition duration-200 font-semibold"
                        >
                          Ok, torna alla Home
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {products.map((product, index) => (
                  <ProductCard key={index} title={product.title} price={product.price} photo={product.photo} />
                ))}


              </div>
              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <div
                  className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm bg-white sm:p-6">
                  <p className="text-xl font-semibold text-black">Sommario</p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-black">N.Prodotti
                        </dt>
                        <dd className="text-base font-medium text-black">{count}</dd>
                      </dl>
                      {products.forEach(product => {
                        total += Number(product.price.substring(1).replace(',', '.'));
                      })}

                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-black">Totale</dt>
                        <dd className="text-base font-medium text-green-600">{total}</dd>
                      </dl>
                    </div>


                  </div>

                  <a href="#"
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-black hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Checkout</a>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!bugFlaky) {
                          window.location.href = "/ecommerce"; // oppure usa router.push se sei in Next.js
                        }
                      }}
                      disabled={bugFlaky}
                      className={`inline-flex items-center gap-2 text-sm font-medium underline ${bugFlaky
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-primary-700 hover:no-underline dark:text-primary-500"
                        }`}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;