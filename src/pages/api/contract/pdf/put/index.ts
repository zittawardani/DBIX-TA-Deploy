import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, GridFSBucket } from "mongodb";
import multer from "multer";
import { Readable } from "stream";
import prisma from "@/utils/prisma";

export const config = {
  api: { bodyParser: false },
};

// Setup multer untuk menangani upload file
const upload = multer({ storage: multer.memoryStorage() });

// Fungsi koneksi ke MongoDB
async function connectToDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  return { client, db: client.db() };
}

// Handler API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Gunakan Promise untuk wrap multer middleware
  await new Promise<void>((resolve, reject) => {
    upload.single("pdfFile")(req as any, res as any, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const { contractId, userId } = req.body;
  const pdfBuffer = (req as any).file?.buffer;

  if (!pdfBuffer || !userId || !contractId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Buat nama file unik dengan format: contract_userId_productId_timestamp.pdf
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `contract_${contractId}_${userId}_${timestamp}.pdf`;

  let client: MongoClient | undefined;
  try {
    // Koneksi ke MongoDB
    const dbConnection = await connectToDatabase();
    client = dbConnection.client;
    const db = dbConnection.db;

    // Buat bucket GridFS untuk penyimpanan PDF
    const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

    // Buat upload stream ke GridFS dengan nama file unik
    const uploadStream = bucket.openUploadStream(filename);
    Readable.from(pdfBuffer).pipe(uploadStream);

    // Tunggu upload selesai
    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    // Simpan metadata ke database Prisma
    const savedPdf = await prisma.contractDigital.update({
      where: { id: contractId },
      data: {
        filename: filename, // Simpan nama file unik
      },
    });

    return res.status(201).json({ message: "PDF saved", pdf: savedPdf });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return res.status(500).json({ error: "Error saving PDF", details: error });
  } finally {
    // Tutup koneksi MongoDB
    if (client) await client.close();
  }
}
