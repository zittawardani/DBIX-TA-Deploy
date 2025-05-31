import prisma from "@/utils/prisma"
import { NextApiRequest, NextApiResponse } from "next"


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  try {
    const data = await prisma.user.findFirst({ where: { id: String(id) } })
    res.status(200).send(data)
  } catch (error) {
    res.status(500).json({
      msg: 'Internal server error!',
      error
    } )
    console.log(error);
  }
}

export default handler