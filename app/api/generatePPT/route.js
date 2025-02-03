import PptxGenJS from "pptxgenjs";

export async function POST(req) {
  try {
    const { slides, title, author, slideFormat } = await req.json();
    let pres = new PptxGenJS();
    pres.layout = slideFormat === "4:3" ? "LAYOUT_4x3" : "LAYOUT_WIDE";

    let logoPath = "public/logo.jpg";
    let imagePath = "public/nature.jpg";

    // Naslovni slajd
    let titleSlide = pres.addSlide();

    // Naslov

    titleSlide.addText(title || "Moja predstavitev", {
      x: "10%",
      y: "40%",
      w: "80%",
      h: "10%",
      fontSize: 48,
      fontFace: "Roboto, Arial, sans-serif", // Nastavitev moderne pisave
      color: "#1E3A8A", // Temno siva (elegantnejša od modre)
      bold: true,
      align: "center",
    });

    //Avtor
    titleSlide.addText(`Avtor: ${author || "Neznano"}`, {
      x: "10%",
      y: "60%",
      w: "80%",
      h: "10%",
      fontSize: 24,
      fontFace: "Roboto, Arial, sans-serif",
      color: "#4F6FD6", // Mehkejša siva barva za podnaslov
      align: "center",
    });

    // Logotip v zgornjem desnem kotu
    titleSlide.addImage({
      path: logoPath,
      x: "85%",
      y: "5%",
      w: 1,
      h: 1,
    });

    // Slide s tabelo kot vzorec
    let slide = pres.addSlide();

    // Definiraj podatke za tabelo (prva vrstica so kategorije)
    let tableData = [
      [
        {
          text: "Kategorija 1",
          options: { bold: true, color: "#FFFFFF", fill: "#1E3A8A" },
        },
        {
          text: "Kategorija 2",
          options: { bold: true, color: "#FFFFFF", fill: "#1E3A8A" },
        },
        {
          text: "Kategorija 3",
          options: { bold: true, color: "#FFFFFF", fill: "#1E3A8A" },
        },
      ],
      ["Vrednost 1", "Vrednost 2", "Vrednost 3"],
      ["Vrednost 4", "Vrednost 5", "Vrednost 6"],
    ];

    // Dodaj TABELO v slajd

    slide.addText("Slide Tabela", {
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

    slide.addTable(tableData, {
      x: "30%",
      y: "40%",
      w: "80%",
      colW: [2, 2, 2], // Enaka širina stolpcev
      rowH: [0.5, 0.5, 0.5], // Nastavljena višina vrstic
      border: { color: "888888", pt: 1 }, // Tanka siva obroba
    });

    // Uporabniški slajdi (Title and Content Layout)
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

      slide.addText(" Prva točka\n Druga točka\n Tretja točka", {
        x: "5%",
        y: 1.5,
        w: "50%",
        h: 5,
        fontSize: 20,
        fontFace: "Roboto, Arial, sans-serif",
        color: "#222222",
        align: "left",
        bullet: true,
        lineSpacing: 50, // Poveča razmik med vrsticami
      });

      slide.addImage({
        path: imagePath, // Ni slike, samo okvir
        x: "60%",
        y: "40%",
        w: "40%", // Širina okvirja
        h: "30%", // Višina okvirja
        line: { color: "888888", width: 2 }, // Siv okvir, ki prikazuje, da tu pride slika
      });

      slide.addImage({ path: logoPath, x: "85%", y: "5%", w: 1, h: 1 });
    }

    // Zaključni slajd (Hvala!)
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
