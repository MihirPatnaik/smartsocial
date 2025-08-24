// src/pages/smartsocial.tsx
import { useState } from "react";
import ImagePreview from "../smartsocial/components/ImagePreview";

export default function SmartSocialPage() {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  const handleBack = () => {
    setImageUrl("");
    setCaption("");
    setHashtags("");
  };

  const handleNext = () => {
    alert("✅ Post ready!\n\n" + caption + "\n" + hashtags);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">SmartSocial AI Assistant</h1>

      {!imageUrl && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Enter your post idea
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Opening a candy store"
            className="w-full p-3 border rounded-lg"
          />

          <button
            onClick={() => {
              if (!prompt.trim()) {
                alert("Please enter a prompt.");
                return;
              }
              setEnhancedPrompt(prompt);
            }}
            className="mt-3 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Enhance Prompt
          </button>
        </div>
      )}

      <ImagePreview
        prompt={prompt}
        enhancedPrompt={enhancedPrompt}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        setCaption={setCaption}
        setHashtags={setHashtags}
        onBack={handleBack}
        onNext={handleNext}
      />

      {caption && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold">Generated Caption</h3>
          <p>{caption}</p>
          <h3 className="font-semibold mt-2">Hashtags</h3>
          <p>{hashtags}</p>
        </div>
      )}
    </div>
  );
}
