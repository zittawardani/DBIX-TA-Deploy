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
    const { id, userId, productId } = req.query;

    console.log(userId, productId);

    console.log("Received query params:", { id, userId, productId });

    // Validasi query parameters
    if (!id && (!userId || !productId)) {
      return res.status(400).json({
        error: "Missing discussion ID or (userId and productId)",
      });
    }

    let discussion = null;

    if (id) {
      console.log("Searching by ID...");
      discussion = await prisma.discuss.findFirst({
        where: { id: id as string },
        include: {
          product: { select: { id: true, name: true, variants: true } },
          user: { select: { id: true, name: true, email: true } },
          admin: { select: { id: true, username: true } },
          messages: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              user: { select: { name: true } },
              admin: { select: { username: true } },
              image: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    } else if (userId && productId) {
      console.log("Searching by userId and productId...");
      discussion = await prisma.discuss.findFirst({
        where: {
          userId: userId as string,
          productId: productId as string,
        },
        include: {
          product: { select: { id: true, name: true, variants: true } },
          user: { select: { id: true, name: true, email: true } },
          admin: { select: { id: true, username: true } },
          messages: {
            select: {
              id: true,
              content: true,
              image: true,
              createdAt: true,
              user: { select: { name: true } },
              admin: { select: { username: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }

    if (!discussion) {
      console.log("Discussion not found!");
      return res.status(200).json(null);
    }

    return res.status(200).json({
      ...discussion,
      messages: discussion.messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        image: msg.image,
        createdAt: msg.createdAt,
        sender: msg.user ? msg.user.name : msg.admin?.username || "Admin",
      })),
    });
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
