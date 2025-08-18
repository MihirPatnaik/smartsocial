// src/smartsocial/pages/smartsocialHome.tsx
import React, { useState } from "react";
import { enhancePrompt } from "../agents/promptEnhancerAgent";
import { callImageAgent, callCaptionAgent } from "../agents/imageAgents";
import ImagePreview from "../components/ImagePreview";
import { useToast } from "../components/ui/use-toast";

export default function SmartSocialPage() {
  const { toast } = useToast();

  const [userPrompt, setUserPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [step, setStep] = useState<"input" | "preview">("input");
  const [loading, setLoading] = useState(false);

  // 🔄 Reset everything
  const handleReset = () => {
    setUserPrompt("");
    setEnhancedPrompt("");
    setImageUrl("");
    setCaption("");
    setHashtags("");
    setStep("input");
  };

  // ✨ Enhance + auto caption/hashtags
  const handleEnhance = async () => {
    if (!userPrompt.trim()) {
      toast({ title: "⚠️ Please enter a prompt before refining." });
      return;
    }
    setLoading(true);
    try {
      const result = await enhancePrompt(userPrompt);
      setEnhancedPrompt(result);

      const { caption, hashtags } = await callCaptionAgent(userPrompt);
      setCaption(caption);
      setHashtags(hashtags);
    } catch (err) {
      console.error("❌ Enhancement failed:", err);
      toast({ title: "❌ Enhancement failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  // 🖼️ Generate Image (medium 512x512 first)
  const handleGenerateImage = async () => {
    if (!enhancedPrompt.trim()) {
      toast({ title: "⚠️ Refine your post before generating an image." });
      return;
    }
    setLoading(true);
    try {
      // Step 1: quick preview
      const preview = await callImageAgent(enhancedPrompt, "512x512");
      setImageUrl(preview.imageUrl);

      // Step 2: regenerate HQ in background
      callImageAgent(enhancedPrompt, "1024x1024").then((hq) => {
        if (hq.imageUrl) setImageUrl(hq.imageUrl);
      });
    } catch (err) {
      console.error("❌ Image generation failed:", err);
      toast({ title: "❌ Image generation failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  // 👀 Preview confirm
  const handlePreviewConfirm = () => {
    if (!caption || !imageUrl) {
      toast({ title: "⚠️ Generate an image & caption first." });
      return;
    }
    alert("✅ Post ready to publish or export!");
    handleReset();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-left text-purple-600">
        🚀 SmartSocial Assistance
      </h1>

      {step === "input" && (
        <div className="space-y-4">
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="💡 What's on your mind? (e.g., Opening a flower shop with amazing offers)"
            className="w-full border rounded-lg p-3 h-32"
          />
          <p
            className={`text-right text-sm ${
              userPrompt.length > 650 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {userPrompt.length}/700
          </p>

          {/* Action buttons → always active, no disabled */}
          <div className="flex justify-between space-x-4 mt-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Reset
            </button>
            <button
              onClick={handleEnhance}
              className="px-6 py-2 text-white rounded-lg bg-green-500 hover:bg-green-600"
            >
              {loading ? "Enhancing..." : "Refine Post"}
            </button>
            <button
              onClick={handleGenerateImage}
              className="px-6 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600"
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>
            <button
              onClick={() => {
                if (!caption || !imageUrl) {
                  toast({ title: "⚠️ Refine & generate an image first." });
                  return;
                }
                setStep("preview");
              }}
              className="px-6 py-2 text-white rounded-lg bg-purple-500 hover:bg-purple-600"
            >
              Preview
            </button>
          </div>

          {/* Inline Preview */}
          {(caption || imageUrl) && (
            <div className="mt-6 space-y-4">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Generated Preview"
                  className="rounded-lg shadow-md w-64 mx-auto"
                />
              )}
              {caption && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Caption</h3>
                  <p>{caption}</p>
                  <h3 className="font-semibold mt-4 mb-2">Hashtags</h3>
                  <p>{hashtags}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {step === "preview" && (
        <ImagePreview
          prompt={userPrompt}
          enhancedPrompt={enhancedPrompt}
          imageUrl={imageUrl}
          caption={caption}
          hashtags={hashtags}
          setImageUrl={setImageUrl}
          setCaption={setCaption}
          setHashtags={setHashtags}
          onBack={handleReset}
          onPreviewConfirm={handlePreviewConfirm}
        />
      )}
    </div>
  );
}
