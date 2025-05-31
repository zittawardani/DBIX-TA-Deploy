// pages/api/contract/progress/get.ts
import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const { contractId } = req.query;

  if (typeof contractId !== "string") {
    return res.status(400).json({ message: "Invalid contractId" });
  }

  try {
    const progressList = await prisma.contractProgress.findMany({
      where: { contractId },
      orderBy: { createdAt: "desc" }, // urutkan terbaru ke atas
    });

    return res.status(200).json(progressList);
  } catch (error) {
    console.error("❌ Failed to fetch progress:", error);
    return res.status(500).json({ message: "Failed to fetch progress" });
  }
}
