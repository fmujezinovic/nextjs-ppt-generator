"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [slides, setSlides] = useState(1);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const secondSectionRef = useRef(null);

  const scrollToSecondSection = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/generatePPT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slides: parseInt(slides),
          title,
          author,
          slideFormat: "4:3",
        }),
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
    } catch (error) {
      console.error("Napaka pri prenosu datoteke:", error);
    }
  };

  return (
    <main>
      {/* PRVA SEKCJA */}
      <section className="bg-red-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-8 py-2">
          <div className="font-bold">Ustvarjalec prosojnic</div>
          <div className="space-x-8 max-md:hidden">
            <a className="link link-hover" href="#home">
              Home
            </a>
          </div>
          <div className="flex justify-end w-full">
            <button
              onClick={scrollToSecondSection}
              className="bg-blue-500 text-white px-6 py-2 rounded-md mt-2 hover:bg-blue-600"
            >
              Pojdi na ustvarjanje prosojnic
            </button>
          </div>
        </div>
      </section>

      {/* DRUGA SEKCJA */}
      <section
        className="bg-gray-200 text-center lg:text-left py-32 px-8 max-w-5xl mx-auto flex flex-col lg:flex-row gap-14 items-center lg:items-start"
        id="home"
      >
        <div className="flex max-w-6xl w-full items-center gap-8">
          <div className="w-1/2">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
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

      {/* TRETJA SEKCJA */}
      <section
        ref={secondSectionRef}
        className="h-screen flex flex-col justify-center items-center bg-white"
      >
        <h1 className="text-4xl font-bold">Ustvari PowerPoint</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Vnesi naslov"
          className="border p-2 rounded-md mt-4 text-lg w-64 text-center"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Vnesi avtorja"
          className="border p-2 rounded-md mt-4 text-lg w-64 text-center"
        />
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
