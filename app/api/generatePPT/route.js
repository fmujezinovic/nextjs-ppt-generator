import PptxGenJS from "pptxgenjs";

export async function POST(req) {
  try {
    const { slides, title, author, slideFormat } = await req.json();
    let pres = new PptxGenJS();
    pres.layout = slideFormat === "4:3" ? "LAYOUT_4x3" : "LAYOUT_WIDE";

    let logoPath = "public/ukc-mb-logo.png";

    // Začetni slajd z naslovom in avtorjem (Title Slide)
    let titleSlide = pres.addSlide();
    titleSlide.addText(title || "Moja predstavitev", {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 32,
      bold: true,
    });
    titleSlide.addText(`Avtor: ${author || "Neznano"}`, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1,
      fontSize: 24,
    });
    titleSlide.addImage({ path: logoPath, x: 9, y: 0.2, w: 1, h: 1 });

    // Uporabniški slajdi (Title and Content Layout)
    for (let i = 0; i < slides; i++) {
      let slide = pres.addSlide();
      slide.addText(`Slide ${i + 1}`, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 28,
        bold: true,
      });
      slide.addText(`Vsebina za slide ${i + 1}`, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 5,
        fontSize: 24,
      });
      slide.addImage({ path: logoPath, x: 9, y: 0.2, w: 1, h: 1 });
    }

    // Zaključni slajd (Hvala!)
    let finalSlide = pres.addSlide();
    finalSlide.addText("Hvala!", {
      x: "50%",
      y: "50%",
      w: 6,
      h: 2,
      fontSize: 36,
      align: "center",
      bold: true,
    });
    finalSlide.addImage({ path: logoPath, x: 9, y: 0.2, w: 1, h: 1 });

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
