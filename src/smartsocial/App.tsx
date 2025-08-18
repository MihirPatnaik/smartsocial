import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import ImagePreview from "./components/ImagePreview";
import { Toaster } from "./components/ui/toaster"; // ✅ import toaster

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  return (
    <>
      {/* ✅ Provide toast context to everything inside */}
      <Toaster />

      <Routes>
        <Route
          path="/"
          element={
            <ImagePreview
              prompt={prompt}
              enhancedPrompt={enhancedPrompt}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              setCaption={setCaption}
              setHashtags={setHashtags}
              onBack={() => console.log("Back clicked")}
              onNext={() => console.log("Next clicked")}
            />
          }
        />
      </Routes>
    </>
  );
}
