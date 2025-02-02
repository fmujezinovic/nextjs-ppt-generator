import PptxGenJS from "pptxgenjs";

export async function POST(req) {
  try {
    const { slides, title, author, slideFormat } = await req.json();

    let pres = new PptxGenJS();
    pres.layout = slideFormat === "4:3" ? "LAYOUT_4x3" : "LAYOUT_WIDE";

    let logoPath = "/ukc-mb-logo.png"; // Fiksna pot do logotipa

    // Naslovni slajd
    let titleSlide = pres.addSlide();
    titleSlide.addText(title || "Moja predstavitev", {
      x: 0.5,
      y: 0.5,
      fontSize: 32,
      bold: true,
    });
    titleSlide.addText(`Avtor: ${author || "Neznano"}`, {
      x: 0.5,
      y: 1.5,
      fontSize: 24,
    });
    titleSlide.addImage({ path: logoPath, x: "85%", y: "5%", w: 1.5, h: 1.5 });

    // Ustvarjanje slajdov
    for (let i = 0; i < slides; i++) {
      let slide = pres.addSlide();
      slide.addText(`Slide ${i + 1}`, { x: 0.5, y: 0.5, fontSize: 24 });
      slide.addImage({ path: logoPath, x: "85%", y: "5%", w: 1.5, h: 1.5 });
    }

    // Zaključni slajd
    let finalSlide = pres.addSlide();
    finalSlide.addText("Hvala!", {
      x: "50%",
      y: "50%",
      fontSize: 36,
      align: "center",
      bold: true,
    });
    finalSlide.addImage({ path: logoPath, x: "85%", y: "5%", w: 1.5, h: 1.5 });

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
    console.error("Napaka pri generiranju PowerPointa:", error);
    return new Response(
      JSON.stringify({ error: "Napaka pri generiranju PowerPointa" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
