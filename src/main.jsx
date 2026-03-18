// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; // เพิ่มบรรทัดนี้

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* ครอบ App ไว้ */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
