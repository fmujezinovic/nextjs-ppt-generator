"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [slides, setSlides] = useState(1);
  const secondSectionRef = useRef(null); // Referenca na drugo sekcijo

  // Funkcija za premik na drugo sekcijo
  const scrollToSecondSection = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      <section className="h-screen bg-gray-200 flex items-center justify-center text-center px-10">
        <div className="flex max-w-6xl w-full items-center gap-8">
          {/* Levo: Slika */}
          <div className="w-1/2">
            <Image
              src="https://static1.anpoimages.com/wordpress/wp-content/uploads/2024/01/powerpoint-hero-1.jpg"
              alt="Predstavitev"
              width={500}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Desno: Naslov in podnaslov */}
          <div className="w-1/2 text-left">
            <h1 className="text-4xl font-bold">
              Hitro in enostavno do želenega števila PP prosojnic
            </h1>
            <h2 className="text-xl mt-2 text-gray-600">
              Enostavno vnesite število prosojnic in ustvarite predstavitev!
            </h2>
            <button
              onClick={scrollToSecondSection}
              className="bg-blue-500 text-white px-6 py-2 rounded-md mt-6 hover:bg-blue-600"
            >
              Pojdi na ustvarjanje prosojnic
            </button>
          </div>
        </div>
      </section>

      {/* DRUGA SEKCJA */}
      <section
        ref={secondSectionRef}
        className="h-screen flex flex-col justify-center items-center bg-white"
      >
        <h1 className="text-5xl font-extrabold text-red-500">
          Ustvari PowerPoint
        </h1>
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
      </section>
    </main>
  );
}
