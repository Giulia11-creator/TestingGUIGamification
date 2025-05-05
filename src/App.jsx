import React from "react";
import Signin from './components/Signin.jsx';
import Signup from './components/Signup.jsx';
import Account from './components/Account.jsx';
import TestTextBox from "./components/TestTextBox.jsx";
import { Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold">
        Non è un Bug, è una Feature 🪲
      </h1>
      <AuthContextProvider>
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/account' element={<ProtectedRoute><Account/></ProtectedRoute>} />
        <Route path='/textbox' element={<ProtectedRoute><TestTextBox/></ProtectedRoute>} />
      </Routes>
      </AuthContextProvider>
     
    </div>
  );
}

export default App;
