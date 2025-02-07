import fs from "fs";
import path from "path";

// Provjera da li smo u lokalnom okruženju
const isLocal = process.env.NODE_ENV === "development";
// Datoteka u kojoj se spremaju preuzimanja po datumima
const filePath = path.join(process.cwd(), "public", "download_count.json");

// Pomoćna funkcija za dohvat današnjeg datuma u formatu YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split("T")[0];

//
// Funkcija za ažuriranje preuzimanja u Vercel KV (produkcija)
// Koristi se ključ oblika "downloads:YYYY-MM-DD"
//
const updateVercelKV = async () => {
  try {
    const today = getTodayDate();
    const key = `downloads:${today}`;
    const url = `${process.env.KV_REST_API_URL}/incr/${encodeURIComponent(
      key
    )}`;
    console.log("Updating Vercel KV:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    if (!response.ok)
      throw new Error(`Error updating Vercel KV: ${await response.text()}`);

    const data = await response.json();
    console.log("Vercel KV Update Response:", data);
    return data;
  } catch (error) {
    console.error("Vercel KV error:", error);
    return { error: "Failed to update download count" };
  }
};

//
// GET endpoint - vraća preuzimanja po datumima
//
export async function GET() {
  try {
    if (isLocal) {
      // Ako datoteka ne postoji, vraća se prazan objekt
      if (!fs.existsSync(filePath))
        return new Response(JSON.stringify({ downloads: {} }), { status: 200 });

      const data = fs.readFileSync(filePath, "utf-8");
      return new Response(data, {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // U produkciji koristimo KV endpoint za listanje svih ključeva s prefiksom "downloads:"
      const url = `${
        process.env.KV_REST_API_URL
      }/keys?prefix=${encodeURIComponent("downloads:")}`;
      console.log("Fetching from Vercel KV:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      if (!response.ok)
        throw new Error(`Error fetching count: ${await response.text()}`);

      const result = await response.json();
      // Pretpostavljamo da je result.keys niz objekata u obliku { name: "downloads:YYYY-MM-DD", value: broj }
      const downloads = {};
      result.keys.forEach((item) => {
        const date = item.name.replace("downloads:", "");
        downloads[date] = item.value;
      });

      console.log("Fetched Count:", downloads);
      return new Response(JSON.stringify({ downloads }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching download count:", error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }
}

//
// POST endpoint - povećava broj preuzimanja za današnji datum
//
export async function POST() {
  try {
    if (isLocal) {
      let data = {};
      if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, "utf-8");
        data = JSON.parse(rawData);
      }

      const today = getTodayDate();
      data[today] = (data[today] || 0) + 1;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      return new Response(JSON.stringify({ success: true, downloads: data }), {
        headers: { "Content-Type": "application/json" },
      });
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
