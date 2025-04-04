"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [numSections, setNumSections] = useState("");
  const [sectionTitles, setSectionTitles] = useState([]);
  const router = useRouter();

  const handleSectionCountSubmit = (e) => {
    e.preventDefault();
    const count = Math.max(1, parseInt(numSections, 10) || 1);
    setSectionTitles(Array.from({ length: count }, () => ""));
  };

  const handleNext = () => {
    const queryParams = new URLSearchParams({ title, author });
    sectionTitles.forEach((section, index) => {
      queryParams.append(`section${index + 1}`, section);
    });
    router.push(`/sections?${queryParams.toString()}`);
  };

  const handleSortPictures = () => {
    router.push("/picturegallery");
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-100 w-full py-14 flex justify-center">
        <div className="max-w-5xl flex flex-col md:flex-row items-center gap-10 px-8">
          <div className="w-full md:w-1/2">
            <Image
              src="https://static1.anpoimages.com/wordpress/wp-content/uploads/2024/01/powerpoint-hero-1.jpg"
              alt="PowerPoint"
              width={600}
              height={300}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/2 text-left">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-6">
              Fast track to your presentation! ⚡
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Just press a button below and the presentation draft is already
              yours. 🚀
            </p>
            <p className="text-lg text-gray-700">
              <strong className="text-blue-700">Benefits:</strong> Save time,
              ensure consistency, and impress your audience with minimal effort.
            </p>
          </div>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="w-full py-10 flex justify-center bg-white px-6 sm:px-12">
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            What happens after pressing the button?
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            After filling out the form, your personalized PowerPoint
            presentation will be generated and downloaded instantly. You'll get
            three polished slides to start with.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 items-center mt-6">
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
        </div>
      </section>

      {/* Form Section 1 */}
      <section className="w-full py-10 flex justify-center bg-gray-100">
        <div className="max-w-4xl w-full text-center bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800">
            Enter presentation details
          </h2>
          <form className="space-y-4 mt-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Title"
              required
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Author"
              required
            />
          </form>
        </div>
      </section>

      {/* Form Section 2 */}
      <section className="w-full py-10 flex justify-center bg-gray-200">
        <div className="max-w-4xl w-full text-center bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800">Define Sections</h2>
          <form className="space-y-4 mt-6" onSubmit={handleSectionCountSubmit}>
            <input
              type="number"
              value={numSections}
              onChange={(e) => setNumSections(e.target.value)}
              min="1"
              required
              className="w-full px-4 py-2 border rounded-md text-center"
              placeholder="Number of sections"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-md">
              Confirm
            </button>
          </form>
          {sectionTitles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-left">
                Enter section titles:
              </h3>
              {sectionTitles.map((value, i) => (
                <input
                  key={i}
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const updated = [...sectionTitles];
                    updated[i] = e.target.value;
                    setSectionTitles(updated);
                  }}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder={`Section ${i + 1}`}
                />
              ))}
              <button
                onClick={handleNext}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-md"
              >
                Continue to editor
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sort Picture Files Section */}
      <section className="w-full py-10 flex justify-center bg-white">
        <div className="max-w-4xl w-full text-center bg-gray-50 shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sort images for slides
          </h2>
          <p className="text-md text-gray-600 mb-6">
            Upload images from a folder, sort them in the desired order, and
            rename them sequentially.
          </p>
          <button
            onClick={handleSortPictures}
            className="bg-purple-600 text-white py-2 px-6 rounded-md shadow hover:bg-purple-700"
          >
            Organize Images
          </button>
        </div>
      </section>
    </main>
  );
}
