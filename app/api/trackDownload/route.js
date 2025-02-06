import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "downloads.json");

export async function GET(req) {
  try {
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: "No data available." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching download data:", error);
    return new Response(JSON.stringify({ error: "Error fetching data." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const today = new Date().toISOString().split("T")[0]; // Današnji datum (YYYY-MM-DD)
    let data = {};

    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(rawData);
    }

    data[today] = (data[today] || 0) + 1; // Povečaj števec za današnji dan

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return new Response(
      JSON.stringify({ success: true, downloads: data[today] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error tracking download:", error);
    return new Response(JSON.stringify({ error: "Error tracking download." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
