// File: src/utils/promptCache.ts
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
  } from "firebase/firestore";
  
  import { db } from "./firebaseLogger";
  
  const CACHE_COLLECTION = "prompt_logs";
  
  // 🔁 In-memory session cache
  const memoryCache = new Map<string, string>();
  
  export const checkCachedPrompt = async (caption: string): Promise<string | null> => {
    const q = query(
      collection(db, CACHE_COLLECTION),
      where("caption", "==", caption)
    );
  
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const best = querySnapshot.docs[0].data();
      return best.refinedPrompt || null;
    }
    return null;
  };
  
  export const savePromptToCache = async (caption: string, refinedPrompt: string) => {
    await addDoc(collection(db, CACHE_COLLECTION), {
      caption,
      refinedPrompt,
      timestamp: serverTimestamp(),
    });
  };
  
  // ✅ Combined in-memory + Firebase caching wrapper
  export const getCachedResponse = async (
    prompt: string,
    generatorFn: (prompt: string) => Promise<string>
  ): Promise<string> => {
    const key = caption:${prompt};
  
    // ⚡ First check in-memory
    if (memoryCache.has(key)) {
      console.log("⚡ In-memory cache hit");
      return memoryCache.get(key)!;
    }
  
    // 🔁 Then check Firebase
    const firebaseCached = await checkCachedPrompt(prompt);
    if (firebaseCached) {
      console.log("✅ Firebase cache hit");
      memoryCache.set(key, firebaseCached);
      return firebaseCached;
    }
  
    // 🧠 If not cached, generate and store
    const result = await generatorFn(prompt);
    memoryCache.set(key, result);
    await savePromptToCache(prompt, result);
  
    return result;
  };