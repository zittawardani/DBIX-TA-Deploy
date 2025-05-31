import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { contractId, content } = req.body;

    // Validasi field
    if (!contractId || !content) {
      return res
        .status(400)
        .json({ error: "contractId and content are required" });
    }

    // Pastikan kontrak ada
    const existingContract = await prisma.contractDigital.findUnique({
      where: { id: contractId },
    });

    if (!existingContract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    // Simpan feedback
    const feedback = await prisma.feedback.create({
      data: {
        contractId,
        content,
      },
    });

    await prisma.contractDigital.update({
      where: { id: contractId },
      data: {
        status: "REVISION_REQUESTED",
      },
    });

    return res.status(201).json({
      message: "Feedback created successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
