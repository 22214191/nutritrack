// =============================================
// FIREBASE SETUP
// This file initializes Firebase and exports
// helper functions to read/write data in Firestore.
// All other files import from here.
// =============================================

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Your personal Firebase project config
const firebaseConfig = {
  apiKey:            "AIzaSyAwMn4S2Y7J1Vvxjh1H5jriNebhEdPgBjI",
  authDomain:        "health-app-de8dc.firebaseapp.com",
  projectId:         "health-app-de8dc",
  storageBucket:     "health-app-de8dc.firebasestorage.app",
  messagingSenderId: "1082430524683",
  appId:             "1:1082430524683:web:a37bdc29a5b6ac798be60e",
};

// Initialize Firebase — this connects our app to the cloud
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore database
export const db = getFirestore(app);

// =============================================
// MEAL LOG HELPERS
// Functions to create, read, and delete meals
// =============================================

// Fetch all meals (used for streak calculation on dashboard)
export async function getAllMeals() {
  const snapshot = await getDocs(collection(db, "meals"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Fetch meals for a specific date string like "2026-05-07"
export async function getMealsByDate(dateStr) {
  const q = query(
    collection(db, "meals"),
    where("date", "==", dateStr),
    orderBy("created_at", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Save a new meal to Firestore
export async function createMeal(data) {
  return await addDoc(collection(db, "meals"), {
    ...data,
    created_at: serverTimestamp(), // auto timestamp from Firebase
  });
}

// Delete a meal by its document ID
export async function deleteMeal(id) {
  await deleteDoc(doc(db, "meals", id));
}

// =============================================
// WORKOUT LOG HELPERS
// Same pattern as meal helpers above
// =============================================

export async function getAllWorkouts() {
  const snapshot = await getDocs(collection(db, "workouts"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getWorkoutsByDate(dateStr) {
  const q = query(
    collection(db, "workouts"),
    where("date", "==", dateStr),
    orderBy("created_at", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createWorkout(data) {
  return await addDoc(collection(db, "workouts"), {
    ...data,
    created_at: serverTimestamp(),
  });
}

export async function deleteWorkout(id) {
  await deleteDoc(doc(db, "workouts", id));
}
