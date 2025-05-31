import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

// Middleware untuk mengecek apakah pengguna adalah admin
const isAdmin = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  return !!admin;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { discussionId, adminId, content, image } = req.body;

    if (!discussionId || !adminId || (!content && !image)) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    // ✅ Cek apakah pengguna adalah admin
    const isAdminUser = await isAdmin(adminId);
    if (!isAdminUser) {
      return res
        .status(403)
        .json({ error: "Access denied. Only admins can reply." });
    }

    // ✅ Cek apakah diskusi ada
    let discussion = await prisma.discuss.findUnique({
      where: { id: discussionId },
      include: { messages: true },
    });

    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    // 💬 Tambahkan balasan admin ke dalam diskusi
    const newMessage = await prisma.message.create({
      data: {
        content: content || null,
        image: image || null,
        admin: { connect: { id: adminId } },
        discuss: { connect: { id: discussionId } },
      },
    });

    // 🔄 **Update diskusi dengan pesan baru**
    discussion.messages.push(newMessage);

    return res.status(201).json(discussion);
  } catch (error) {
    console.error("Error handling admin reply:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
