import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    fullName,
    address,
    contractName,
    cost,
    startDate,
    endDate,
    descriptionContract,
    features = [],
    scopeOfWork,
    signature, // base64 ‑ "data:image/png;base64,...."
    userSignature,
  } = req.body;

  try {
    /* ---------------------------------------------------------- */
    /* 1.  Setup dokumen                                          */
    /* ---------------------------------------------------------- */
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 (pts)
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const margin = 50;
    let y = 800;

    /* ---------------------------------------------------------- */
    /* 2.  Util untuk gambar teks & wrap                          */
    /* ---------------------------------------------------------- */

    const drawText = (
      text: string,
      x: number,
      y: number,
      size = 12,
      isBold = false
    ) =>
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? bold : font,
        color: rgb(0, 0, 0),
      });

    const drawWrappedText = (
      text: string,
      x: number,
      yStart: number,
      lineHeight: number,
      maxChars: number
    ) => {
      const lines = text.match(new RegExp(`.{1,${maxChars}}`, "g")) || [text];
      let yPos = yStart;
      lines.forEach((line) => {
        drawText(line, x, yPos);
        yPos -= lineHeight;
      });
      return yPos;
    };

    /* ---------------------------------------------------------- */
    /* 3.  JUDUL tebal + underline                                */
    /* ---------------------------------------------------------- */

    const title = "KONTRAK PERJANJIAN PEMBUATAN PERANGKAT LUNAK";
    const titleSize = 18;
    const titleWidth = bold.widthOfTextAtSize(title, titleSize);
    const titleX = (page.getWidth() - titleWidth) / 2;

    drawText(title, titleX, y, titleSize, true);
    // garis bawah
    page.drawLine({
      start: { x: titleX, y: y - 4 },
      end: { x: titleX + titleWidth, y: y - 4 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });
    y -= 40;

    /* ---------------------------------------------------------- */
    /* 4.  Informasi dasar                                        */
    /* ---------------------------------------------------------- */
    const info = [
      [`Contract Name`, contractName],
      [`Description`, descriptionContract],
      [`Client Name`, fullName],
      [`Address`, address],
      [`Project Cost`, `Rp ${cost}`],
      [`Start Date`, startDate],
      [`End Date`, endDate],
    ];

    info.forEach(([label, value]) => {
      drawText(`${label}:`, margin, (y -= 18), 12, true);
      drawText(String(value || "-"), margin + 120, y);
    });

    /* ---------------------------------------------------------- */
    /* 5.  Fitur                                                  */
    /* ---------------------------------------------------------- */
    y -= 25;
    drawText("Features:", margin, (y -= 15), 12, true);
    features.forEach((f: string) => {
      drawText(`• ${f}`, margin + 20, (y -= 15));
    });

    /* ---------------------------------------------------------- */
    /* 6.  Scope of Work                                          */
    /* ---------------------------------------------------------- */
    y -= 25;
    drawText("Scope of Work:", margin, (y -= 15), 12, true);
    y = drawWrappedText(scopeOfWork, margin + 20, y - 10, 15, 90);

    /* ---------------------------------------------------------- */
    /* 7.  Signature                                              */
    /* ---------------------------------------------------------- */
    if (signature) {
      // hilangkan prefix data URI jika ada
      const base64 = signature.replace(/^data:image\/\w+;base64,/, "");
      const img = await pdfDoc.embedPng(base64);
      const dims = img.scale(0.5);

      page.drawImage(img, {
        x: margin,
        y: y - dims.height - 20,
        width: dims.width,
        height: dims.height,
      });
      y -= dims.height + 30;
    }

    drawText(`Signed by: Admin`, margin, y);
    drawText(`Signed at: ${new Date().toLocaleDateString()}`, margin, y - 15);

    if (userSignature) {
        const base64 = userSignature.replace(/^data:image\/\w+;base64,/, "");
        const img = await pdfDoc.embedPng(base64);
        const userDims = img.scale(0.5);
      
        page.drawImage(img, {
          x: margin,
          y: y - userDims.height - 20, // Posisi di bawah tanda tangan admin
          width: userDims.width,
          height: userDims.height,
        });
        y -= userDims.height + 30;
      }
      
      drawText(`Signed by: User`, margin, y);
      drawText(`Signed at: ${new Date().toLocaleDateString()}`, margin, y - 15);

    /* ---------------------------------------------------------- */
    /* 8.  Kirim PDF                                              */
    /* ---------------------------------------------------------- */
    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("❌ PDF generation error:", err);
    res.status(500).json({ message: "Failed to generate contract." });
  }
}
