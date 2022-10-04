import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCyz44XyfUOnAsmURlvE8Zwx1WJ7gCMgBg",
  authDomain: "shoppinglist-87957.firebaseapp.com",
  projectId: "shoppinglist-87957",
  storageBucket: "shoppinglist-87957.appspot.com",
  messagingSenderId: "907616070649",
  appId: "1:907616070649:web:4081923d6a645378696b28",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
