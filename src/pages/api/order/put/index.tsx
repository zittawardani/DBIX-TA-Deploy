import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const { status } = req.body;

  try {
    const updatedOrder = await prisma.orders.update({
      where: { id: id as string },
      data: { status },
    });

    // Update semua kontrak terkait jadi ACTIVE jika order sukses
    if (status === "Success") {
      const contracts = await prisma.contractDigital.findMany({
        where: {
          userId: updatedOrder.userId[0], // diasumsikan hanya satu user per order
          status: "AWAITING_PAYMENT",
        },
      });

      for (const contract of contracts) {
        await prisma.contractDigital.update({
          where: { id: contract.id },
          data: {
            status: "ACTIVE",
          },
        });
      }
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
