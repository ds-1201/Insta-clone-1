import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVdLZ3PBJBbI4FYYuU4QGMU34x-10gIBA",
  authDomain: "instagram-clone-10956.firebaseapp.com",
  projectId: "instagram-clone-10956",
  storageBucket: "instagram-clone-10956.appspot.com",
  messagingSenderId: "258291610726",
  appId: "1:258291610726:web:a66115c6a898bb3cba69a7",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
