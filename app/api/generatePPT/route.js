import PptxGenJS from "pptxgenjs";

export async function POST(req) {
  try {
    const { slides, title, author, slideFormat } = await req.json();

    let pres = new PptxGenJS();
    pres.layout = slideFormat === "4:3" ? "LAYOUT_4x3" : "LAYOUT_WIDE";

    let logoPath = process.cwd() + "/public/logo.jpg"; // Absolutna pot do slike
    let imagePath = process.cwd() + "/public/nature.jpg";

    // Naslovni slajd
    let titleSlide = pres.addSlide();
    titleSlide.addText(title || "Moja predstavitev", {
      x: "10%",
      y: "40%",
      w: "80%",
      h: "10%",
      fontSize: 48,
      fontFace: "Roboto, Arial, sans-serif",
      color: "#1E3A8A",
      bold: true,
      align: "center",
    });

    titleSlide.addText(`Avtor: ${author || "Neznano"}`, {
      x: "10%",
      y: "60%",
      w: "80%",
      h: "10%",
      fontSize: 24,
      fontFace: "Roboto, Arial, sans-serif",
      color: "#4F6FD6",
      align: "center",
    });

    titleSlide.addImage({ path: logoPath, x: "85%", y: "5%", w: 1, h: 1 });

    // Uporabniški slajdi
    for (let i = 0; i < slides - 1; i++) {
      let slide = pres.addSlide();
      slide.addText(`Slide ${i + 1}`, {
        x: "10%",
        y: 0.5,
        w: "85%",
        h: 1,
        fontFace: "Roboto, Arial, sans-serif",
        color: "#4F6FD6",
        fontSize: 28,
        bold: true,
        align: "center",
      });

      slide.addImage({
        path: imagePath,
        x: "60%",
        y: "40%",
        w: "40%",
        h: "30%",
      });
    }

    // Zaključni slajd
    let finalSlide = pres.addSlide();
    finalSlide.addText("Hvala!", {
      x: "50%",
      y: "50%",
      w: 6,
      h: 2,
      fontSize: 46,
      align: "center",
      bold: true,
    });

    finalSlide.addImage({ path: logoPath, x: 9, y: 0.2, w: 1, h: 1 });

    // Generiranje PPTX
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
