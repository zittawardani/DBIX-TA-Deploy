import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { id, contractName, cost, features, scopeOfWork, status, signature } =
      req.body;

    // Validasi field wajib
    if (
      !id ||
      typeof contractName !== "string" ||
      typeof scopeOfWork !== "string" ||
      !Array.isArray(features) ||
      isNaN(parseFloat(cost))
    ) {
      return res.status(400).json({
        error:
          "id, contractName (string), cost (number), features (array), and scopeOfWork (string) are required.",
      });
    }

    // Periksa apakah kontrak ada
    const existingContract = await prisma.contractDigital.findUnique({
      where: { id },
    });

    if (!existingContract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    // Update kontrak
    const updatedContract = await prisma.contractDigital.update({
      where: { id },
      data: {
        contractName,
        cost: parseFloat(cost),
        features,
        scopeOfWork,
        status,
        signature,
      },
    });

    return res.status(200).json({ success: true, contract: updatedContract });
  } catch (error) {
    console.error("Error updating contract:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
