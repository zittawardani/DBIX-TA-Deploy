import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from 'bcrypt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, phone } = req.body
  const secret = process.env.NEXT_PRIVATE_SECRET_PASS_KEY
  try {

    const hashPass = () => {
      const salted = password + secret
      const hash = bcrypt.hashSync(salted, 16)
      return hash
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashPass(),
        phone,
      }
    })

    res.status(200).json({
      msg: "user registered succesfully!"
    })

  } catch (error) {
    res.status(500).json({ msg: 'Data User Error!', error })
  }

}

export default handler;