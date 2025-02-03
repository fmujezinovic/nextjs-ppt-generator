"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [slides, setSlides] = useState(1);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [slideFormat, setSlideFormat] = useState("16:9");
  const secondSectionRef = useRef(null);

  const scrollToSecondSection = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownload = async () => {
    const response = await fetch("/api/generatePPT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides, title, author, slideFormat }),
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
      {/* PRVA SEKCJA - HEADER */}
      <section className="bg-red-200 w-full py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-8">
          <div className="font-bold text-lg">Ustvarjalec prosojnic 2</div>
          <div>
            <a className="text-black font-medium" href="#home">
              Home
            </a>
          </div>
          <div>
            <button
              onClick={scrollToSecondSection}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Pojdi na ustvarjanje prosojnic
            </button>
          </div>
        </div>
      </section>

      {/* DRUGA SEKCJA - SLIKA, NASLOV, GUMB */}
      <section className="bg-gray-200 w-full py-20 flex justify-center">
        <div className="max-w-5xl flex flex-col lg:flex-row items-center gap-8 px-8">
          {/* Levo: Slika */}
          <div className="w-1/2">
            <Image
              src="https://static1.anpoimages.com/wordpress/wp-content/uploads/2024/01/powerpoint-hero-1.jpg"
              alt="Predstavitev"
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
          {/* Desno: Naslov, podnaslov, gumb */}
          <div className="w-1/2 text-left">
            <h1 className="text-4xl font-extrabold text-blue-700">
              Hitro in enostavno do želenega števila PP prosojnic
            </h1>
            <p className="text-lg text-gray-700 mt-2">
              Enostavno vnesite število prosojnic in ustvarite predstavitev!
            </p>
            <button
              onClick={scrollToSecondSection}
              className="bg-blue-500 text-white px-6 py-2 rounded-md mt-6 hover:bg-blue-600"
            >
              Pojdi na ustvarjanje prosojnic
            </button>
          </div>
        </div>
      </section>

      {/* TRETJA SEKCJA - OBRAZEC */}
      <section
        ref={secondSectionRef}
        className="w-full py-20 flex justify-center"
      >
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-3xl font-bold">
            Vnesite podatke za predstavitev
          </h2>
          <div className="flex justify-center gap-4 mt-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Vnesi naslov predstavitve"
              className="border p-2 rounded-md w-64"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Vnesi avtorja predstavitve"
              className="border p-2 rounded-md w-64"
            />
            <input
              type="number"
              value={slides}
              onChange={(e) => setSlides(e.target.value)}
              min="1"
              className="border p-2 rounded-md w-16 text-center"
            />
          </div>
          <div className="mt-4">
            <label className="mr-2">Izberi obliko slajdov:</label>
            <select
              value={slideFormat}
              onChange={(e) => setSlideFormat(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
            </select>
          </div>
          <button
            onClick={handleDownload}
            className="bg-blue-500 text-white px-6 py-2 rounded-md mt-6 hover:bg-blue-600"
          >
            Ustvari PowerPoint
          </button>
        </div>
      </section>
    </main>
  );
}
