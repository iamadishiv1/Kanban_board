// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Functions for tasks
export const addTask = async (task) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), task);
    return docRef.id;
  } catch (e) {
    console.error('Error adding task: ', e);
  }
};

export const updateTask = async (id, updatedTask) => {
  try {
    const taskDoc = doc(db, 'tasks', id);
    await updateDoc(taskDoc, updatedTask);
  } catch (e) {
    console.error('Error updating task: ', e);
  }
};

export const deleteTask = async (id) => {
  try {
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
  } catch (e) {
    console.error('Error deleting task: ', e);
  }
};

export const getTasks = async () => {
  try {
    const tasksCollection = collection(db, 'tasks');
    const tasksSnapshot = await getDocs(tasksCollection);
    return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Error getting tasks: ', e);
  }
};
