import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBqZVTwNblYtPpXAD1HUXIuzOXvNSKvVEc",
  authDomain: "finalsoa-fae05.firebaseapp.com",
  projectId: "finalsoa-fae05",
  storageBucket: "finalsoa-fae05.appspot.com",
  messagingSenderId: "79853946102",
  appId: "1:79853946102:web:0008b9b79831d17943d8d7",
  measurementId: "G-LY7E4LMDX3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const imageDb = getStorage(app);