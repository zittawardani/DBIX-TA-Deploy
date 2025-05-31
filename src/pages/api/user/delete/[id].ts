import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/utils/prisma";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  try {
    await prisma.user.delete({ where: { id: String(id) } })
    res.status(200).json({
      id: id,
      msg: 'Delete success'
    })

  } catch (error) {
    res.status(500).json({ msg: 'Data User Error!' })
  }

}

export default handler;