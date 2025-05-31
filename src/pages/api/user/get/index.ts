import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next"
const handler = async (req: NextApiRequest, res: NextApiResponse) => {


  try {
    const data = await prisma.user.findMany()
    res.status(200).json(data)

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Data User Error!', error })
  }


}

export default handler; 