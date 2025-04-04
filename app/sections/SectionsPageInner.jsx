"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";

function SectionsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get("title") || "";
  const author = searchParams.get("author") || "";
  const [fontTitle, setFontTitle] = useState(
    searchParams.get("fontTitle") || "Arial Black"
  );
  const [fontText, setFontText] = useState(
    searchParams.get("fontText") || "Roboto"
  );

  const sectionTitles = [];
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("section")) sectionTitles.push(value);
  }

  const [selectedTab, setSelectedTab] = useState(0);
  const [sections, setSections] = useState(
    sectionTitles.map((name) => ({
      name,
      slides: 1,
      contents: [
        {
          title: "",
          paragraph1: "",
          paragraph2: "",
          paragraph3: "",
          customImage: undefined,
          customImageUrl: "",
        },
      ],
    }))
  );

  const handleUploadImagesDirectly = async (e) => {
    const files = Array.from(e.target.files || []);
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const imageUrls = await Promise.all(files.map((f) => toBase64(f)));

    const updated = [...sections];
    let index = 0;
    for (const section of updated) {
      for (
        let i = 0;
        i < section.contents.length && index < imageUrls.length;
        i++
      ) {
        section.contents[i].customImage = imageUrls[index++];
        section.contents[i].customImageUrl = "";
      }
    }

    setSections(updated);
  };

  const handlePaste = (e, sectionIndex) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain");
    const chunks = pasted.split(/\n{2,}/).map((chunk) =>
      chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    );

    const newSlides = chunks.map((lines) => ({
      title: lines[0] || "",
      paragraph1: lines[1] || "",
      paragraph2: lines[2] || "",
      paragraph3: lines[3] || "",
      customImage: undefined,
      customImageUrl: "",
    }));

    const updated = [...sections];
    updated[sectionIndex].slides = newSlides.length;
    updated[sectionIndex].contents = newSlides;
    setSections(updated);
  };

  const handleGeneratePPT = async () => {
    const response = await fetch("/api/generatePPT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections, title, author, fontTitle, fontText }),
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
    } else {
      const err = await response.json();
      alert("Napaka pri generiranju prezentacije: " + err.error);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Edit Slides by Section</h1>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title Font
              </label>
              <select
                className="border px-3 py-2 rounded-md"
                value={fontTitle}
                onChange={(e) => setFontTitle(e.target.value)}
              >
                <option value="Arial Black">Arial Black</option>
                <option value="Georgia">Georgia</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Text Font
              </label>
              <select
                className="border px-3 py-2 rounded-md"
                value={fontText}
                onChange={(e) => setFontText(e.target.value)}
              >
                <option value="Roboto">Roboto</option>
                <option value="Calibri">Calibri</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
           

            <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer text-sm text-center">
              Upload images into slides
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUploadImagesDirectly}
                className="hidden"
              />
            </label>

            <button
              onClick={handleGeneratePPT}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Create Presentation
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        {sections.map((section, i) => (
          <button
            key={i}
            onClick={() => setSelectedTab(i)}
            className={`px-4 py-2 rounded-md ${
              selectedTab === i
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      {sections.map((section, sectionIndex) =>
        selectedTab === sectionIndex ? (
          <div key={sectionIndex} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Slides
              </label>
              <input
                type="number"
                min={1}
                value={section.slides}
                onChange={(e) => {
                  const count = Math.max(1, parseInt(e.target.value, 10) || 1);
                  const updated = [...sections];
                  updated[sectionIndex].slides = count;
                  if (updated[sectionIndex].contents.length < count) {
                    updated[sectionIndex].contents.push(
                      ...Array(
                        count - updated[sectionIndex].contents.length
                      ).fill({
                        title: "",
                        paragraph1: "",
                        paragraph2: "",
                        paragraph3: "",
                        customImage: undefined,
                        customImageUrl: "",
                      })
                    );
                  } else {
                    updated[sectionIndex].contents = updated[
                      sectionIndex
                    ].contents.slice(0, count);
                  }
                  setSections(updated);
                }}
                className="border px-3 py-2 rounded-md"
              />
            </div>

            {section.contents.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className="border p-4 rounded-md bg-white flex flex-col md:flex-row gap-6"
              >
                <div className="w-full md:w-2/3 space-y-4">
                  <input
                    type="text"
                    value={slide.title}
                    placeholder="Slide title"
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sectionIndex].contents[slideIndex].title =
                        e.target.value;
                      setSections(updated);
                    }}
                    onPaste={(e) => handlePaste(e, sectionIndex)}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  {["paragraph1", "paragraph2", "paragraph3"].map(
                    (field, i) => (
                      <textarea
                        key={field}
                        placeholder={`Paragraph ${i + 1}`}
                        value={slide[field] || ""}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[sectionIndex].contents[slideIndex][field] =
                            e.target.value;
                          setSections(updated);
                        }}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    )
                  )}

                  <div
                    className="mb-2 text-sm p-3 border rounded-md bg-gray-100"
                    onPaste={(e) => {
                      const items = e.clipboardData?.items;
                      if (!items) return;
                      for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.type.indexOf("image") === 0) {
                          const file = item.getAsFile();
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updated = [...sections];
                            updated[sectionIndex].contents[
                              slideIndex
                            ].customImage = reader.result;
                            updated[sectionIndex].contents[
                              slideIndex
                            ].customImageUrl = "";
                            setSections(updated);
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <ImagePlus className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Paste or upload an image
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const updated = [...sections];
                          updated[sectionIndex].contents[
                            slideIndex
                          ].customImage = reader.result;
                          updated[sectionIndex].contents[
                            slideIndex
                          ].customImageUrl = "";
                          setSections(updated);
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="mb-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={slide.customImageUrl || ""}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sectionIndex].contents[
                          slideIndex
                        ].customImageUrl = e.target.value;
                        updated[sectionIndex].contents[slideIndex].customImage =
                          "";
                        setSections(updated);
                      }}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/3 border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-500 mb-2">
                    Preview
                  </p>
                  <div className="flex items-center">
                    <div className="w-2/3">
                      <h3 className="text-xl font-bold text-blue-700 mb-2">
                        {slide.title || "Slide Title"}
                      </h3>
                      <ul className="space-y-1 text-gray-800 text-sm">
                        {[
                          slide.paragraph1,
                          slide.paragraph2,
                          slide.paragraph3,
                        ].map((p, idx) => p && <li key={idx}>📌 {p}</li>)}
                      </ul>
                    </div>
                    <div className="w-1/3 pl-4 self-center">
                      {slide.customImage ? (
                        <img
                          src={slide.customImage}
                          alt="Custom"
                          className="w-full h-auto object-contain"
                        />
                      ) : slide.customImageUrl ? (
                        <img
                          src={slide.customImageUrl}
                          alt="From URL"
                          className="w-full h-auto object-contain"
                        />
                      ) : (
                        <img
                          src="/nature.jpg"
                          alt="Default"
                          className="w-full h-auto object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null
      )}
    </main>
  );
}

export default SectionsPageInner;
