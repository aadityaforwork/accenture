// Import the necessary Firebase services
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore"; 
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxJokJ2N-iTPQ07laoSPhuXHlktyclEYk",
  authDomain: "accenture-f73fe.firebaseapp.com",
  projectId: "accenture-f73fe",
  storageBucket: "accenture-f73fe.appspot.com",
  messagingSenderId: "367950919202",
  appId: "1:367950919202:web:bfe04368ffe6343f2efc7b",
  measurementId: "G-CK131CJCYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Example function to get data from Firestore
async function getData() {
  const querySnapshot = await getDocs(collection(db, "your-collection-name"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

// Call the function to retrieve data
getData();
