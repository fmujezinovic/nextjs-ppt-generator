import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Dodamo podporo za Vercel KV Database
const isLocal = process.env.NODE_ENV === "development";
const filePath = path.join(process.cwd(), "public", "download_count.json");

// Funkcija za Vercel KV Database - povećava broj preuzimanja za današnji datum
const updateVercelKV = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const url = `${process.env.KV_REST_API_URL}/incr/downloads:${today}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error("Error updating Vercel KV");

    return await response.json();
  } catch (error) {
    console.error("Vercel KV error:", error);
    return { error: "Failed to update daily download count" };
  }
};

// Funkcija za pridobivanje broja preuzimanja za određeni datum iz Vercel KV baze
const getDownloadCountForDate = async (date) => {
  try {
    const url = `${process.env.KV_REST_API_URL}/get/downloads:${date}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error("Error fetching download count");

    const data = await response.json();
    return data.result || 0; // Ako nema podataka, vraća 0
  } catch (error) {
    console.error(`Error fetching download data for ${date}:`, error);
    return 0; // Ako se dogodi greška, vraćamo 0 umesto prekida aplikacije
  }
};

// GET zahteva - vrača broj prenosov za zadnjih 7 dni
export async function GET() {
  try {
    if (isLocal) {
      // Lokalno shranjujemo podatke v JSON datoteko
      if (!fs.existsSync(filePath))
        return NextResponse.json({ downloads: [] }, { status: 200 });

      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return NextResponse.json(data);
    } else {
      // Na Vercelu uporabljamo KV Database - pridobivamo podatke za zadnjih 7 dni
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      });

      const results = await Promise.all(
        last7Days.map(async (date) => ({
          date,
          count: await getDownloadCountForDate(date),
        }))
      );

      return NextResponse.json({ downloads: results });
    }
  } catch (error) {
    console.error("Error fetching download data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

// POST zahteva - poveča število prenosov za današnji datum
export async function POST() {
  try {
    if (isLocal) {
      let data = { downloads: {} };
      if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, "utf-8");
        data = JSON.parse(rawData);
      }

      const today = new Date().toISOString().split("T")[0];

      if (!data.downloads[today]) {
        data.downloads[today] = 0;
      }
      data.downloads[today] += 1;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      return NextResponse.json({ success: true, downloads: data.downloads });
    } else {
      const result = await updateVercelKV();
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Error tracking download:", error);
    return NextResponse.json(
      { error: "Error tracking download" },
      { status: 500 }
    );
  }
}
