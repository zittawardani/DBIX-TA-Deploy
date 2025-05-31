import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;
  try {
    const data = await prisma.product.findFirst({
      where: { code_product: String(code) },
      include: { reviews: true },
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({
      msg: "internal server error!",
      error,
    });
  }
};

export default handler;
