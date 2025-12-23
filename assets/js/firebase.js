import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "my-earning-blog.firebaseapp.com",
  projectId: "my-earning-blog",
  storageBucket: "my-earning-blog.appspot.com",
  messagingSenderId: "591454593500",
  appId: "1:591454593500:web:fac21a06e5faa542f1af19"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
