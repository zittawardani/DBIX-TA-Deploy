import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method Not Allowed" });
  }

  try {
    const { id, userId, status } = req.query;

    // Jika query mengandung id, ambil satu data kontrak
    if (id && typeof id === "string") {
      const contract = await prisma.contractDigital.findUnique({
        where: { id },
        include: {
          product: { select: { name: true } },
        },
      });

      if (!contract) {
        return res.status(404).json({ msg: "Contract not found" });
      }

      return res.status(200).json(contract);
    }

    // Kalau tidak ada id, ambil banyak data berdasarkan filter lain
    const where: any = {};
    if (userId && typeof userId === "string") where.userId = userId;
    if (status && typeof status === "string") where.status = status;

    const contracts = await prisma.contractDigital.findMany({
      where,
      include: {
        product: true,
        feedback: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(contracts);
  } catch (error) {
    console.error("❌ Get Contract Error:", error);
    return res.status(500).json({ msg: "Data Contract Error!" });
  }
};

export default handler;
