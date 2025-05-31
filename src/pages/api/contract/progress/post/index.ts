// pages/api/contract/progress/post.ts
import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { contractId, description } = req.body;

  if (!contractId || !description) {
    return res.status(400).json({ message: "contractId and description are required" });
  }

  try {
    const progress = await prisma.contractProgress.create({
      data: {
        contractId,
        description,
      },
    });
    return res.status(200).json(progress);
  } catch (error) {
    console.error("❌ Failed to add progress:", error);
    return res.status(500).json({ message: "Failed to add progress" });
  }
}
