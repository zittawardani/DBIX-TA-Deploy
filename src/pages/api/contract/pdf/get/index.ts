import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, GridFSBucket } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { filename } = req.query;
  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "Filename is required" });
  }

  const client = new MongoClient(process.env.DATABASE_URL!);

  try {
    // Koneksi ke MongoDB
    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

    // Periksa apakah file ada sebelum mengirimkannya
    const files = await bucket.find({ filename }).toArray();
    if (files.length === 0) {
      await client.close();
      return res.status(404).json({ error: "File not found" });
    }

    // Set header respons sebagai PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    // Stream PDF ke klien
    const downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);

    downloadStream.on("error", async (err) => {
      console.error("Stream error:", err);
      await client.close();
      return res.status(500).json({ error: "Error streaming PDF" });
    });

    downloadStream.on("end", async () => {
      await client.close();
    });
  } catch (error) {
    console.error("Error retrieving PDF:", error);
    await client.close();
    return res
      .status(500)
      .json({ error: "Error retrieving PDF", details: error });
  }
}
