import PptxGenJS from "pptxgenjs";

export async function POST(req) {
  try {
    const { slides, title, author, slideFormat } = await req.json();

    let pres = new PptxGenJS();
    pres.layout = "LAYOUT_WIDE"; // Uvijek koristite wide format

    let logoPath = process.cwd() + "/public/logo.jpg";
    let imagePath = process.cwd() + "/public/nature.jpg";
    let backgroundPath = process.cwd() + "/public/background-image.png";

    // Naslovni slajd
    let titleSlide = pres.addSlide();
    titleSlide.background = { path: backgroundPath };
    titleSlide.addText(title || "Title", {
      x: 1,
      y: 3,
      w: 11,
      h: 1,
      fontSize: 52,
      fontFace: "Arial black, sans-serif",
      color: "#1E3A8A",
      bold: true,
      align: "center",
    });

    titleSlide.addText(`${author || "Autor"}`, {
      x: 1,
      y: 4.5,
      w: 11,
      h: 1,
      fontSize: 24,
      fontFace: "Roboto, Arial, sans-serif",
      color: "#4F6FD6",
      align: "center",
    });

    titleSlide.addImage({ path: logoPath, x: 11, y: 0.5, w: 1, h: 1 });

    // Uporabniški slajdi
    for (let i = 0; i < slides - 2; i++) {
      let slide = pres.addSlide();
      slide.background = { path: backgroundPath };

      slide.addText("Heading 1", {
        x: 0.8,
        y: 0.4,
        w: 8,
        h: 1,
        fontSize: 32,
        bold: true,
        color: "1F497D",
        fontFace: "Roboto, Arial, sans-serif",
      });

      slide.addText(
        [
          {
            text: "📌 Subtitle 1\n",
            options: { bold: true, color: "1F497D", fontSize: 20 },
          },
          {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n\n",
            options: { fontSize: 16, color: "333333" },
          },
          {
            text: "📌 Subtitle 2\n",
            options: { bold: true, color: "1F497D", fontSize: 20 },
          },
          {
            text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.\n\n\n",
            options: { fontSize: 16, color: "333333" },
          },
          {
            text: "📌 Subtitle 3\n",
            options: { bold: true, color: "1F497D", fontSize: 20 },
          },
          {
            text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
            options: { fontSize: 16, color: "333333" },
          },
        ],
        {
          x: 0.8,
          y: 1.5,
          w: 6.5,
          h: 5,
          fontFace: "Roboto, Arial, sans-serif",
        }
      );

      slide.addImage({
        path: imagePath,
        x: 8,
        y: 2,
        w: 4.2,
        h: 4.2,
        rounding: 0.3,

        shadow: {
          type: "outer",
          angle: 45,
          blur: 5,
          offset: 3,
          color: "888888",
        }, // Blaga senka
      });
    }

    // Zaključni slajd
    let finalSlide = pres.addSlide();
    finalSlide.background = { path: backgroundPath };
    finalSlide.background = { path: backgroundPath };
    finalSlide.addText("Thank you for your attention!", {
      x: 1,
      y: 3,
      w: 11,
      h: 1,
      fontSize: 52,
      fontFace: "Arial black, sans-serif",
      color: "#1E3A8A",
      bold: true,
      align: "center",
    });

    finalSlide.addImage({ path: logoPath, x: 11, y: 0.5, w: 1, h: 1 });

    // Generiranje PPTX
    const data = await pres.write("base64");
    const buffer = Buffer.from(data, "base64");

    return new Response(buffer, {
      headers: {
        "Content-Disposition": "attachment; filename=your-presentation.pptx",
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
