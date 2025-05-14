import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const Cart = () => {
  const count = Number(sessionStorage.getItem("count"));
  const storedProducts = sessionStorage.getItem("products");
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  const length = Array.isArray(products) ? products.length : 0;
  let total = 0;

  return (
    <section class="bg-blue-100 py-8 antialiased  md:py-16">
      <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 class="text-xl font-semibold text-black  sm:text-2xl">Carrello</h2>

        <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div class="space-y-6">
              <div
                class="rounded-lg bg-white p-4 shadow-sm  md:p-6">
                {count > length && (
                  <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    Hai trovato un Bug!!! Se il pulsante del carrello viene premuto troppo rapidamente dopo
                    l'inserimento del prodotto, il prodotto non viene registrato!
                  </div>
                )}
                {products.map((product, index) => (
                  <ProductCard key={index} title={product.title} price={product.price} photo={product.photo} />
                ))}


              </div>
              <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <div
                  class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm bg-white sm:p-6">
                  <p class="text-xl font-semibold text-black">Sommario</p>

                  <div class="space-y-4">
                    <div class="space-y-2">
                      <dl class="flex items-center justify-between gap-4">
                        <dt class="text-base font-normal text-black">N.Prodotti
                        </dt>
                        <dd class="text-base font-medium text-black">{count}</dd>
                      </dl>
                      {products.forEach(product => {
                        total += Number(product.price.substring(1).replace(',', '.'));
                      })}

                      <dl class="flex items-center justify-between gap-4">
                        <dt class="text-base font-normal text-black">Totale</dt>
                        <dd class="text-base font-medium text-green-600">{total}</dd>
                      </dl>
                    </div>


                  </div>

                  <a href="#"
                    class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-black hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Checkout</a>

                  <div class="flex items-center justify-center gap-2">
                    <a href="/ecommerce" title=""
                      class="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
                      Continua lo shopping
                      <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                      </svg>
                    </a>
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