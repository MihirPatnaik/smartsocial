// D:\datasenceai\src\smartsocial\pages\PostNow.tsx
import { useState } from "react";
import ImagePreview from "../components/ImagePreview";

export default function PostNow() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Enter Your Post Idea</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your post idea..."
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={() => {
              // In your real flow, you'd enhance prompt here
              setEnhancedPrompt(prompt);
              handleNext();
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <ImagePreview
          prompt={prompt}
          enhancedPrompt={enhancedPrompt}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          setCaption={setCaption}     // ⬅️ Added
          setHashtags={setHashtags}   // ⬅️ Added
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Post is Ready 🎉</h2>

          {imageUrl && (
            <img src={imageUrl} alt="Generated" className="rounded-lg shadow-md" />
          )}

          {caption && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Caption</h3>
              <p>{caption}</p>
            </div>
          )}

          {hashtags && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Hashtags</h3>
              <p className="text-blue-500">{hashtags}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={() => alert("Post submitted! 🚀")}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Post Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
