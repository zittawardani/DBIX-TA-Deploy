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
    descriptionContract,
    startDate,
    endDate,
    features = [],
    cost,
    signature,
    userSignature,
  } = req.body;

  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const margin = 50;
    let y = 800;

    const checkNewPage = () => {
      if (y < 100) {
        page = pdfDoc.addPage([595, 842]);
        y = 800;
      }
    };

    const drawText = (
      text: string,
      x: number,
      yPos: number,
      size = 12,
      isBold = false
    ) => {
      page.drawText(text, {
        x,
        y: yPos,
        size,
        font: isBold ? bold : font,
        color: rgb(0, 0, 0),
      });
    };

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
        checkNewPage();
        drawText(line, x, yPos);
        yPos -= lineHeight;
      });
      return yPos;
    };

    // Header Title
    const title = "KONTRAK PERJANJIAN PEMBUATAN PERANGKAT LUNAK";
    const titleSize = 16;
    const titleWidth = bold.widthOfTextAtSize(title, titleSize);
    drawText(title, (page.getWidth() - titleWidth) / 2, y, titleSize, true);

    page.drawLine({
      start: { x: margin, y: y - 5 },
      end: { x: page.getWidth() - margin, y: y - 5 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    y -= 40;

    // Nomor kontrak
    drawText("Nomor: ", margin, (y -= 20));

    // Pihak
    drawText("Pihak yang terlibat:", margin, (y -= 30), 12, true);
    drawText(
      "Pihak Pertama, selaku pihak yang memesan perangkat lunak.",
      margin,
      (y -= 20)
    );
    drawText(`Nama: ${fullName}`, margin + 20, (y -= 20));
    drawText(`Alamat: ${address}`, margin + 20, (y -= 20));

    drawText(
      "Pihak Kedua, selaku pihak yang mengembangkan perangkat lunak.",
      margin,
      (y -= 30)
    );
    drawText(`Nama: Developer`, margin + 20, (y -= 20));
    drawText(`Alamat: Alamat Developer`, margin + 20, (y -= 20));

    drawText(
      "Masing-masing pihak telah sepakat untuk mengadakan perjanjian kerjasama dengan ketentuan dan syarat sebagai berikut:",
      margin,
      (y -= 40)
    );

    // PASAL 1
    drawText("Pasal 1 - Ruang Lingkup Pekerjaan", margin, (y -= 25), 12, true);
    drawText(`Nama proyek: ${contractName}`, margin, (y -= 20));
    drawText(`Deskripsi proyek: ${descriptionContract}`, margin, (y -= 20));
    drawText(`Platform: Website/Mobile`, margin, (y -= 20));
    drawText(`Teknologi: React.JS`, margin, (y -= 20));
    drawText("Fitur utama:", margin, (y -= 20));

    for (const feature of features) {
      checkNewPage();
      drawText(`• ${feature}`, margin + 20, (y -= 15));
    }

    // PASAL 2
    y -= 20;
    checkNewPage();
    drawText("Pasal 2 - Jangka Waktu Pengerjaan", margin, (y -= 25), 12, true);
    drawText(`Dimulai: ${startDate}`, margin, (y -= 20));
    drawText(`Selesai: ${endDate}`, margin, (y -= 20));

    // PASAL 3
    y -= 20;
    checkNewPage();
    drawText("Pasal 3 - Biaya dan Pembayaran", margin, (y -= 25), 12, true);
    drawText(`Total biaya: Rp ${cost}`, margin, (y -= 20));

    // PASAL 4
    y -= 20;
    checkNewPage();
    drawText("Pasal 4 - Hak dan Kewajiban", margin, (y -= 25), 12, true);
    y = drawWrappedText(
      "Pihak Pertama berkewajiban memberikan spesifikasi yang jelas dan umpan balik tepat waktu.",
      margin,
      y - 10,
      15,
      90
    );
    y = drawWrappedText(
      "Pihak Kedua berkewajiban menyelesaikan proyek sesuai spesifikasi dan jadwal.",
      margin,
      y - 10,
      15,
      90
    );
    y = drawWrappedText(
      "Hak kekayaan intelektual menjadi milik Pihak Pertama setelah pembayaran selesai.",
      margin,
      y - 10,
      15,
      90
    );

    // PASAL 5
    y -= 20;
    checkNewPage();
    drawText("Pasal 5 - Garansi dan Pemeliharaan", margin, (y -= 25), 12, true);
    y = drawWrappedText(
      "Garansi 2 minggu setelah selesai proyek. Perbaikan bug gratis. Maintenance tambahan dinegosiasi ulang.",
      margin,
      y - 10,
      15,
      90
    );

    // PASAL 6
    y -= 20;
    checkNewPage();
    drawText(
      "Pasal 6 - Pembatalan dan Penyelesaian Sengketa",
      margin,
      (y -= 25),
      12,
      true
    );
    y = drawWrappedText(
      "Pembatalan kontrak wajib pemberitahuan 7 hari sebelumnya. Sengketa diselesaikan secara musyawarah atau hukum di Banyuwangi.",
      margin,
      y - 10,
      15,
      90
    );

    // Tanda Tangan
    y -= 40;
    checkNewPage();
    drawText("Pihak Pertama", margin, (y -= 20), 12, true);
    drawText("Pihak Kedua", margin + 250, y, 12, true);

    if (userSignature) {
      const img = await pdfDoc.embedPng(
        userSignature.replace(/^data:image\/\w+;base64,/, "")
      );
      page.drawImage(img, {
        x: margin,
        y: y - 80,
        width: 100,
        height: 50,
      });
    }

    if (signature) {
      const img = await pdfDoc.embedPng(
        signature.replace(/^data:image\/\w+;base64,/, "")
      );
      page.drawImage(img, {
        x: margin + 250,
        y: y - 80,
        width: 100,
        height: 50,
      });
    }

    y -= 100;
    drawText(`[${fullName}]`, margin, y);
    drawText(`[Developer]`, margin + 250, y);

    // Final
    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate contract." });
  }
}
