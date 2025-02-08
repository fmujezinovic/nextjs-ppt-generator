import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Dodamo podporo za Vercel KV Database
const isLocal = process.env.NODE_ENV === "development";
const filePath = path.join(process.cwd(), "public", "download_count.json");

// Funkcija za Vercel KV Database
const updateVercelKV = async () => {
  try {
    const url = `${process.env.KV_REST_API_URL}/incr/downloads`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error("Error updating Vercel KV");

    const data = await response.json();
    return data; // moze isto return await response.json();
  } catch (error) {
    console.error("Vercel KV error:", error);
    return { error: "Failed to update download count" };
  }
};

// GET zahteva - vrača število prenosov
export async function GET() {
  try {
    if (isLocal) {
      // Lokalno shranjujemo podatke v JSON datoteko
      if (!fs.existsSync(filePath))
        return NextResponse.json({ count: 0 }, { status: 200 });
      ``;

      const data = fs.readFileSync(filePath, "utf-8");
      return NextResponse.json(JSON.parse(data));
    } else {
      // Na Vercelu uporabljamo KV Database
      const url = `${process.env.KV_REST_API_URL}/get/downloads`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      if (!response.ok) throw new Error("Error fetching download count");

      const data = await response.json();
      return new Response(JSON.stringify({ count: data.result || 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching download data:", error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }
}

// POST zahteva - poveča število prenosov
export async function POST() {
  try {
    if (isLocal) {
      let data = { count: 0 };
      if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, "utf-8");
        data = JSON.parse(rawData);
      }

      data.count += 1;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      return new Response(
        JSON.stringify({ success: true, count: data.count }),
        { headers: { "Content-Type": "application/json" } }
      );
    } else {
      const result = await updateVercelKV();
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error tracking download:", error);
    return new Response(JSON.stringify({ error: "Error tracking download" }), {
      status: 500,
    });
  }
}
