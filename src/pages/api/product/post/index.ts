import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import prisma from "@/utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    code_product,
    name,
    price,
    image,
    category,
    variants,
    details,
    spec,
    information,
    sold,
    rate,
    stock,
    minOrder,
    desc,
  } = req.body;
  if (req.method === "POST") {
    try {
      await prisma.product.create({
        data: {
          code_product: code_product
            ? code_product
            : randomUUID({ disableEntropyCache: true })
                .toUpperCase()
                .slice(-12),
          name,
          price,
          desc,
          image,
          category,
          variants,
          details,
          spec,
          information,
          sold,
          rate,
          stock,
          minOrder,
        },
      });
      res.status(200).send("data created succesfully!");
    } catch (error) {
      res.status(500).json({ msg: "Data Product Error!", error });
      console.log(error);
    }
  } else {
    res.status(400).send("method not allowed!");
  }
};

export default handler;
