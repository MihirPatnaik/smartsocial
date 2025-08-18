// src/smartsocial/components/ImagePreview.tsx
import React from "react";

export default function ImagePreview({
  prompt,
  enhancedPrompt,
  imageUrl,
  caption,
  hashtags,
  setImageUrl,
  setCaption,
  setHashtags,
  onBack,
  onPreviewConfirm,
}: {
  prompt: string;
  enhancedPrompt: string;
  imageUrl: string;
  caption: string;
  hashtags: string;
  setImageUrl: (url: string) => void;
  setCaption: (caption: string) => void;
  setHashtags: (tags: string) => void;
  onBack: () => void;
  onPreviewConfirm: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* 🔒 Debug block for Original/Enhanced prompt (hidden by default) */}
      {/* 
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Original Prompt</h3>
        <p>{prompt}</p>
        <h3 className="font-semibold mt-4 mb-2">Enhanced Prompt</h3>
        <p>{enhancedPrompt || "No enhanced prompt yet"}</p>
      </div>
      */}

      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Generated" className="rounded-lg shadow-md" />
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Caption</h3>
        <p>{caption}</p>
        <h3 className="font-semibold mt-4 mb-2">Hashtags</h3>
        <p>{hashtags}</p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={onPreviewConfirm}
          className="px-6 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          Preview
        </button>
      </div>
    </div>
  );
}
