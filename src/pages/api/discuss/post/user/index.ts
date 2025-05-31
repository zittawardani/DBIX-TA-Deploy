import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { productId, userId, content, image } = req.body;

    // ✅ **Validasi: Pastikan hanya salah satu dari content atau imageUrl yang dikirim**
    if (!productId || !userId || (!content && !image)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (content && image) {
      return res.status(400).json({
        error: "Only one of content or imageUrl can be provided per message",
      });
    }

    // 🔍 **Cek apakah diskusi sudah ada untuk produk & pengguna ini**
    let discussion = await prisma.discuss.findFirst({
      where: { productId, userId },
      include: { messages: true },
    });

    if (!discussion) {
      // 🆕 **Jika belum ada, buat diskusi baru & tambahkan pesan pertama**
      discussion = await prisma.discuss.create({
        data: {
          product: { connect: { id: productId } },
          user: { connect: { id: userId } },
          messages: {
            create: {
              content: content || null,
              image: image || null,
              user: { connect: { id: userId } },
            },
          },
        },
        include: { messages: true },
      });
    } else {
      // 💬 **Jika diskusi sudah ada, tambahkan pesan baru**
      const newMessage = await prisma.message.create({
        data: {
          content: content || null,
          image: image || null,
          user: { connect: { id: userId } },
          discuss: { connect: { id: discussion.id } },
        },
      });

      discussion.messages.push(newMessage);
    }

    return res.status(201).json(discussion);
  } catch (error) {
    console.error("Error handling discussion:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
