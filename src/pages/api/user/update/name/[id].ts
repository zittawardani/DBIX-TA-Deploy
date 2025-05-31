import prisma from "@/utils/prisma"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const { name } = req.body
  if (req.method === 'PUT') {
    try {
      const resp = await prisma.user.update({
        where: {
          id: String(id)
        },
        data: { name }
      })

      res.status(200).send(resp.name)
    } catch (error) {
      res.status(500).json({ error })
    }
  } else {
    res.status(405).send('Method not allowed!')
  }
}

export default handler