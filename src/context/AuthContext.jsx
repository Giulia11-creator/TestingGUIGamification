/*import { createContext, useContext, useState } from "react";
import { getAuth,signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
    createUserWithEmailAndPassword
     } from 'firebase/auth';
import auth from '../firebase';
import db from '../firebase';
import { setDoc, doc } from "firebase/firestore";
const UserContext = createContext()

export const AuthContextProvider = ({children}) => {
    const createUser = (email, password) =>{
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          psw: user.password,
          id: user.uid
        });
      }

        return createUserWithEmailAndPassword(auth, email, password);

    }
    return(
        <UserContext.Provider value={createUser}>
        {children}
      </UserContext.Provider>
    )
}
export const UserAuth = () =>{
    return useContext(UserContext)
}*/
// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // assicurati che questi siano esportati correttamente

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const createUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const createdUser = userCredential.user;

    await setDoc(doc(db, "Users", createdUser.uid), {
      email: createdUser.email,
      id: createdUser.uid,
      createdAt: new Date()
    });

    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, createUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => useContext(UserContext);
