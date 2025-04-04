"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function PictureGalleryPage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [fileURLs, setFileURLs] = useState([]);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setFileURLs(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleReturnToSections = () => {
    const search = sessionStorage.getItem("presentationSearch") || "";
    router.push("/sections" + search);
  };

const handleDownloadZip = async () => {
  const JSZip = (await import("jszip")).default;
  const saveAs = (await import("file-saver")).default;
  const zip = new JSZip();

  files.forEach((file, index) => {
    const fileName = `${index + 1}${file.name.slice(
      file.name.lastIndexOf(".")
    )}`;
    zip.file(fileName, file);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "images.zip");
};


  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fileURLs.findIndex((id) => id === active.id);
      const newIndex = fileURLs.findIndex((id) => id === over?.id);
      const newURLs = arrayMove(fileURLs, oldIndex, newIndex);
      const newFiles = arrayMove(files, oldIndex, newIndex);
      setFileURLs(newURLs);
      setFiles(newFiles);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Sort and Export Images</h1>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        className="mb-6"
      />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={fileURLs}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 bg-gray-100 p-4 rounded">
            {fileURLs.map((url, index) => (
              <SortableImage key={url} id={url} index={index} url={url} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {files.length > 0 && (
        <div className="flex flex-col gap-4 mt-8 max-w-sm">
          <button
            onClick={handleDownloadZip}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download as ZIP
          </button>
        </div>
      )}

      <button
        onClick={handleReturnToSections}
        className="mt-8 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Vrni se na sekcije
      </button>
    </main>
  );
}

function SortableImage({ id, index, url }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex flex-col items-center bg-white rounded shadow-md p-2 cursor-move"
    >
      <img
        src={url}
        alt={`Image ${index + 1}`}
        className="object-cover w-full h-48 rounded"
      />
      <span className="mt-2 text-sm text-gray-700 font-semibold">
        {index + 1}
      </span>
    </div>
  );
}
