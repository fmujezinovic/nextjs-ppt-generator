"use client";
import { useState } from "react";

export default function Home() {
  const [slides, setSlides] = useState(1);

  const handleDownload = async () => {
    const response = await fetch("/api/generatePPT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides: parseInt(slides) }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "presentation.pptx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error("Napaka pri ustvarjanju PowerPointa");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Ustvari PowerPoint</h1>
      <input
        type="number"
        value={slides}
        onChange={(e) => setSlides(e.target.value)}
        min="1"
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <button
        onClick={handleDownload}
        style={{ marginLeft: "10px", padding: "10px 20px" }}
      >
        Ustvari PowerPoint
      </button>
    </div>
  );
}
