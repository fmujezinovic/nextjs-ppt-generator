import PptxGenJS from "pptxgenjs";

export async function POST(req) {
  try {
    const { slides } = await req.json();
    let pres = new PptxGenJS();

    // Dodaj prazne diapozitive
    for (let i = 0; i < slides; i++) {
      let slide = pres.addSlide();
      slide.addText(`Slide ${i + 1}`, { x: 1, y: 1, fontSize: 24 });
    }

    // Shranjevanje kot base64
    const data = await pres.write("base64");
    const buffer = Buffer.from(data, "base64");

    return new Response(buffer, {
      headers: {
        "Content-Disposition": "attachment; filename=presentation.pptx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Napaka pri generiranju PowerPointa" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
