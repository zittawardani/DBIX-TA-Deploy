import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ msg: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ msg: "Invalid contract ID" });
  }

  try {
    await prisma.feedback.deleteMany({
      where: { contractId: id },
    });

    await prisma.contractDigital.delete({
      where: { id },
    });

    return res.status(200).json({ msg: "Contract deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Contract Error:", error);
    return res.status(500).json({ msg: "Delete Data Contract Error!" });
  }
};

export default handler;
