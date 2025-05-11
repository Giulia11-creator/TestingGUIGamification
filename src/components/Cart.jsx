import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const Cart = () => {
  const count = Number(sessionStorage.getItem("count"));
  const storedProducts = sessionStorage.getItem("products");
  const products = storedProducts ? JSON.parse(storedProducts) : [];
  const length = Array.isArray(products) ? products.length : 0;

  return (
    <section className="bg-blue-100 py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-black sm:text-2xl">Shopping Cart</h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:flex-col lg:items-start xl:gap-8">

          {count > length && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              Hai trovato un Bug!!! Se il pulsante del carrello viene premuto troppo rapidamente dopo l'inserimento del prodotto, il prodotto non viene registrato!
            </div>
          )}
          {products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              price={product.price}
              photo={product.photo}
            />
          ))}

          <a
            href="#"
            className="flex w-full rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-black hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Proceed to Checkout
          </a>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">or</span>
            <a
              href="/ecommerce"
              title=""
              className="inline-flex gap-2 text-sm font-medium text-primary-700 underline hover:no-underline text-black"
            >
              Continue Shopping
              <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
