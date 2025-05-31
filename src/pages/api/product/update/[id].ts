import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/utils/prisma";
import { randomUUID } from "crypto";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const { code_product, name, price, image, category, variants, details, spec, information,  stock, minOrder, desc } = req.body
  if (req.method === 'PUT') {
    try {
      await prisma.product.update({
        where:
          { code_product: String(id) },
        data: {
          code_product: code_product ? code_product : randomUUID({ disableEntropyCache: true }).toUpperCase().slice(-12),
          name,
          price,
          desc,
          image,
          category,
          variants,
          details,
          spec,
          information,
          stock,
          minOrder,
        }
      })
      res.status(200).json({
        id: id,
        msg: ' Update Success'
      })

    } catch (error) {
      res.status(500).json({ msg: 'Data Product Error!', error })
    }
  } else {
    res.status(400).send('method not allowed!')
  }

}

export default handler;