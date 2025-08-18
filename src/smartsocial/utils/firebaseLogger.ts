// src/utils/firebaseLogger.ts

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAnGmY0oC9SxxoRXU0rra4P9CDXwKSTYJc",
  authDomain: "datasenceai-c4e5f.firebaseapp.com",
  projectId: "datasenceai-c4e5f",
  storageBucket: "datasenceai-c4e5f.firebasestorage.app",
  messagingSenderId: "356206907698",
  appId: "1:356206907698:web:59314d156854ebff26c72b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//
// 🔄 LOG GENERAL AGENT OUTPUT
//
export const logToFirebase = async (logData: {
  prompt: string;
  caption: string;
  status: string;
}) => {
  try {
    await addDoc(collection(db, "agent_logs"), {
      ...logData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("🔥 Firebase log failed:", error);
  }
};

//
// 🔍 CHECK PROMPT-BASED CACHE
//
export const checkFirebaseCache = async (
  prompt: string,
  status: string = "imagePrompt"
): Promise<string | null> => {
  try {
    const logsRef = collection(db, "agent_logs");
    const q = query(
      logsRef,
      where("prompt", "==", prompt),
      where("status", "==", status)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return doc.data().caption;
    }
    return null;
  } catch (error) {
    console.error("🔥 Firebase cache check failed:", error);
    return null;
  }
};

//
// ✅ CHECK IF SVG DIAGRAM IS CACHED
//
export const getCachedSVG = async (prompt: string): Promise<string | null> => {
  try {
    const docRef = doc(db, "svg_diagrams", encodeURIComponent(prompt));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().svg || null;
    }
    return null;
  } catch (error) {
    console.error("🔥 SVG cache check failed:", error);
    return null;
  }
};

//
// ✅ SAVE SVG DIAGRAM TO FIREBASE
//
export const saveSVGToCache = async (prompt: string, svg: string): Promise<void> => {
  try {
    const docRef = doc(db, "svg_diagrams", encodeURIComponent(prompt));
    await setDoc(docRef, {
      prompt,
      svg,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("🔥 SVG Firebase caching failed:", error);
  }
};
