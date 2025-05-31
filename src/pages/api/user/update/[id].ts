import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/utils/prisma";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const { name, email, emailVerified, password, items } = req.body
  try {
    await prisma.user.update({
      where:
        { id: String(id) },
      data: {
        name,
        email,
        emailVerified,
        password,
        items
      }
    })
    res.status(200).json({
      id: id,
      msg: ' Update Success'
    })

  } catch (error) {
    res.status(500).json({ msg: 'Data User Error!' })
  }

}

export default handler;