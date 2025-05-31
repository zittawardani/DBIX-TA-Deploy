import prisma from "@/utils/prisma"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code_product } = req.query
  const { context, rate, userId } = req.body
  if (req.method === 'POST') {
    try {
      const user = await prisma.user.findFirst({where: {id: userId}})

      await prisma.review.create({
        data: {
          name: String(user?.name),
          image: String(user?.image),
          rate,
          context,
          code_product: String(code_product)
        }
      })
      res.status(200).send('success')
    } catch (error) {
      res.status(500).json({
        msg: 'internal server Error',
        error
      })
      console.log(error)
    }
  } else {
    res.status(405).send('Method not allowed!')
  }
  
}

export default handler