"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [slides, setSlides] = useState(3);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const secondSectionRef = useRef(null);

  const scrollToSecondSection = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/generatePPT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides, title, author, slideFormat: "16:9" }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "your-presentation.pptx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Beleženje prenosov
      await fetch("/api/trackDownload", { method: "POST" });
    } else {
      console.error("Error generating PowerPoint");
    }
  };

  return (
    <main>
      {/* First Section - Image, Title, Button */}
      <section className="bg-gray-200 w-full py-10 flex justify-center">
        <div className="max-w-5xl flex flex-col lg:flex-row items-center gap-8 px-8">
          <div className="w-full lg:w-1/2 lg:-ml-12">
            <Image
              src="https://static1.anpoimages.com/wordpress/wp-content/uploads/2024/01/powerpoint-hero-1.jpg"
              alt="Presentation"
              width={600}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="w-1/2 text-left">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-6">
              Fast track to your presentation! ⚡
            </h1>
            <p className="text-lg text-gray-700 mt-2">
              Just press a button 🚀 – the presentation draft is already yours!
            </p>
          </div>
        </div>
      </section>

      {/* Second Section - Form */}
      <section
        ref={secondSectionRef}
        className="w-full py-10 flex justify-center bg-gray-200"
      >
        <div className="max-w-4xl w-full text-center bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800">
            Enter presentation details
          </h2>
          <form className="space-y-4 mt-6" onSubmit={handleDownload}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Number of slides (optional)
              </label>
              <input
                type="number"
                value={slides}
                onChange={(e) => setSlides(e.target.value)}
                min="3"
                placeholder="Enter the number of slides"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300 text-center"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Title of presentation (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title of your presentation"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Author of presentation (optional)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter the author of the presentation"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Create PowerPoint
            </button>
          </form>
        </div>
      </section>

      {/* Third Section - What the button creates */}
      <section className="w-full py-10 flex justify-center bg-gray-100 px-6 sm:px-12">
        <div className="max-w-5xl w-full text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">
            What the press of a button creates?
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            After you press a button, a PowerPoint presentation is created and
            downloaded into your download folder. Minimally, you have 3 slides
            that look like this:
          </p>

          {/* Image Preview Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 items-center">
            <Image
              src="/slide1-preview.png"
              alt="Slide 1 Preview"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
            <Image
              src="/slide2-preview.png"
              alt="Slide 2 Preview"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
            <Image
              src="/slide3-preview.png"
              alt="Slide 3 Preview"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
          </div>

          <p className="text-lg text-gray-700 mt-6">
            If you want more slides, you can change the number in the form. You
            can also add your own title and the name of the author of the
            presentation.
          </p>

          <p className="text-lg text-blue-700 mt-4 font-semibold">Enjoy! 🎉</p>
        </div>
      </section>
    </main>
  );
}
