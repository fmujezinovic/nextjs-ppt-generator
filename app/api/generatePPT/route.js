import PptxGenJS from "pptxgenjs";

export const POST = async (req) => {
  try {
    const {
      sections,
      title,
      author,
      fontTitle = "Arial",
      fontText = "Roboto",
    } = await req.json();

    const pres = new PptxGenJS();
    pres.layout = "LAYOUT_WIDE";

    const logoPath = process.cwd() + "/public/logo.jpg";
    const imagePath = process.cwd() + "/public/nature.jpg";
    const backgroundPath = process.cwd() + "/public/background-image.png";

    const titleSlide = pres.addSlide();
    titleSlide.background = { path: backgroundPath };
    titleSlide.addText(title || "Title", {
      x: 1,
      y: 3,
      w: 11,
      h: 1,
      fontSize: 52,
      fontFace: fontTitle,
      color: "#1E3A8A",
      bold: true,
      align: "center",
    });
    titleSlide.addText(author || "Author", {
      x: 1,
      y: 4.5,
      w: 11,
      h: 1,
      fontSize: 24,
      fontFace: fontText,
      color: "#4F6FD6",
      align: "center",
    });
    titleSlide.addImage({ path: logoPath, x: 11, y: 0.5, w: 1, h: 1 });

    for (const section of sections) {
      const sectionSlide = pres.addSlide();
      sectionSlide.background = { path: backgroundPath };
      sectionSlide.addText(section.name || "Section", {
        x: 1,
        y: 3,
        w: 11,
        h: 1,
        fontSize: 40,
        fontFace: fontTitle,
        color: "#1E3A8A",
        bold: true,
        align: "center",
      });

      for (const s of section.contents) {
        const slide = pres.addSlide();
        slide.background = { path: backgroundPath };

        slide.addText(s.title || "Untitled", {
          x: 0.8,
          y: 0.4,
          w: 8,
          h: 1,
          fontSize: 32,
          bold: true,
          color: "1F497D",
          fontFace: fontTitle,
          shrinkText: true,
        });

        slide.addText(
          [
            s.paragraph1 && {
              text: "📌 " + s.paragraph1 + "\n\n\n",
              options: { fontSize: 16, color: "333333" },
            },
            s.paragraph2 && {
              text: "📌 " + s.paragraph2 + "\n\n\n",
              options: { fontSize: 16, color: "333333" },
            },
            s.paragraph3 && {
              text: "📌 " + s.paragraph3,
              options: { fontSize: 16, color: "333333" },
            },
          ].filter(Boolean),
          {
            x: 0.8,
            y: 1.5,
            w: 6.5,
            h: 5,
            fontFace: fontText,
            shrinkText: true,
            valign: "middle",
          }
        );

        const imageOpts = {
          x: 7.5,
          y: 1.5,
          w: 4.5,
          h: 5,
          sizing: {
            type: "contain", // ✅ ohrani proporce slike
            w: 4.5,
            h: 5,
          },
          rounding: 0.3,
          shadow: {
            type: "outer",
            angle: 45,
            blur: 5,
            offset: 3,
            color: "888888",
          },
        };

        try {
          if (s.customImage) {
            slide.addImage({
              data: s.customImage,
              ...imageOpts,
            });
          } else if (s.customImageUrl?.startsWith("http")) {
            const res = await fetch(s.customImageUrl);
            if (!res.ok) throw new Error("Slika ni dosegljiva");
            const buffer = await res.arrayBuffer();
            const base64Image = Buffer.from(buffer).toString("base64");
            const mimeType = res.headers.get("content-type") || "image/jpeg";
            slide.addImage({
              data: `data:${mimeType};base64,${base64Image}`,
              ...imageOpts,
            });
          } else {
            slide.addImage({
              path: imagePath,
              ...imageOpts,
            });
          }
        } catch (err) {
          console.warn("Napaka pri sliki, uporabljen fallback:", err.message);
          slide.addImage({ path: imagePath, ...imageOpts });
        }
      }
    }

    const finalSlide = pres.addSlide();
    finalSlide.background = { path: backgroundPath };
    finalSlide.addText("Thank you for your attention!", {
      x: 1,
      y: 3,
      w: 11,
      h: 1,
      fontSize: 52,
      fontFace: fontTitle,
      color: "#1E3A8A",
      bold: true,
      align: "center",
    });
    finalSlide.addImage({ path: logoPath, x: 11, y: 0.5, w: 1, h: 1 });

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
};
