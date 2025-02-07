import fs from "fs";
import path from "path";

const isLocal = process.env.NODE_ENV === "development";
const filePath = path.join(process.cwd(), "public", "download_count.json");

// Funkcija za ažuriranje broja preuzimanja u Vercel KV
const updateVercelKV = async () => {
  try {
    const url = `${process.env.KV_REST_API_URL}/incr/downloads`; // Promijenjeno "increment" u "incr"
    console.log("Updating Vercel KV:", url); // Debugging log

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    });

    if (!response.ok)
      throw new Error(`Error updating Vercel KV: ${await response.text()}`);

    const data = await response.json();
    console.log("Vercel KV Update Response:", data); // Debugging log
    return data;
  } catch (error) {
    console.error("Vercel KV error:", error);
    return { error: "Failed to update download count" };
  }
};

// GET request - vraća broj preuzimanja
export async function GET() {
  try {
    if (isLocal) {
      if (!fs.existsSync(filePath))
        return new Response(JSON.stringify({ count: 0 }), { status: 200 });

      const data = fs.readFileSync(filePath, "utf-8");
      return new Response(data, {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const url = `${process.env.KV_REST_API_URL}/get/downloads`;
      console.log("Fetching from Vercel KV:", url); // Debugging log

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      if (!response.ok)
        throw new Error(`Error fetching count: ${await response.text()}`);

      const data = await response.json();
      console.log("Fetched Count:", data); // Debugging log
      return new Response(JSON.stringify({ count: data.result || 0 }), {
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

// POST request - povećava broj preuzimanja
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
        {
          headers: { "Content-Type": "application/json" },
        }
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
