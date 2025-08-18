// src/main.tsx


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App"; // Main DatasenceAI homepage
import SmartSocialPage from "./smartsocial/pages/smartsocialHome"; // SmartSocial UI
import { ToastProvider } from "./smartsocial/components/ui/toast"; // ✅ our provider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Main site homepage */}
          <Route path="/" element={<App />} />
          {/* SmartSocial mini-app */}
          <Route path="/smartsocial" element={<SmartSocialPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);
