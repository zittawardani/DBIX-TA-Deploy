import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const { items } = req.body
  if (req.method === 'PUT') {
    try {
      await prisma.user.update({
        where: { id: String(id) },
        data: {
          items
        }
      })
      res.status(200).send('items update success!')
    } catch (error) {
      res.status(500).json({
        msg: 'Internal server error!',
        error
      })
    }
  } else {
    res.status(405).send('Method not allowed!')
  }
};

export default handler;