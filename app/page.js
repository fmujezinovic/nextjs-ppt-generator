"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [slides, setSlides] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Poskrbimo, da se vsebina naloži samo v brskalniku
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <main>
      {/* PRVA SEKCJA */}
      <section className="h-screen bg-gray-200 flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-bold">
          Hitro in enostavno do želenega števila PP prosojnic
        </h1>
        <h2 className="text-xl mt-2 text-gray-600">
          Enostavno vnesite število prosojnic in ustvarite predstavitev!
        </h2>
      </section>

      {/* DRUGA SEKCJA */}
      <section className="h-screen flex flex-col justify-center items-center bg-white">
        <h1 className="text-3xl font-semibold">Ustvari PowerPoint</h1>

        {/* Input se prikaže šele, ko je komponenta naložena v brskalniku */}
        {isClient && (
          <>
            <input
              type="number"
              value={slides}
              onChange={(e) => setSlides(e.target.value)}
              min="1"
              className="border p-2 rounded-md mt-4 text-lg w-24 text-center"
            />
            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-600"
            >
              Ustvari PowerPoint
            </button>
          </>
        )}
      </section>
    </main>
  );
}
