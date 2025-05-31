import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, productId } = req.query;

    // Buat filter dinamis berdasarkan query yang tersedia
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (productId) filter.productId = productId;

    const discussions = await prisma.discuss.findMany({
      where: filter, // Terapkan filter
      include: {
        product: {
          select: { id: true, name: true, variants: true, image: true },
        },
        user: { select: { id: true, name: true, email: true } },
        admin: { select: { id: true, username: true } },
        messages: {
          select: {
            id: true,
            content: true,
            image: true,
            createdAt: true,
            user: { select: { id: true } },
            admin: { select: { username: true } },
          },
        },
      },
    });

    if (!discussions || discussions.length === 0) {
      return res.status(404).json({ error: "No discussions found" });
    }

    return res.status(200).json(discussions);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
