import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ message: "ID diperlukan untuk menghapus diskusi" });
    }

    const deleted = await prisma.$transaction([
      prisma.message.deleteMany({ where: { discussId: id } }),
      prisma.discuss.delete({ where: { id } }),
    ]);

    return res.status(200).json({
      message: "Diskusi dan pesan berhasil dihapus",
      deletedDiscuss: deleted[1],
    });
  } catch (error: any) {
    console.error("Gagal menghapus diskusi:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ message: "Diskusi tidak ditemukan" });
    }

    return res.status(500).json({ message: "Gagal menghapus diskusi" });
  }
}
