import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCbSv1gj-fiNx9HQcpgDMEAda-hGHWhqlg",
  authDomain: "monkey-blogging-reactjs.firebaseapp.com",
  projectId: "monkey-blogging-reactjs",
  storageBucket: "monkey-blogging-reactjs.appspot.com",
  messagingSenderId: "499471566945",
  appId: "1:499471566945:web:0abe915d98350aeb7f4220",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
