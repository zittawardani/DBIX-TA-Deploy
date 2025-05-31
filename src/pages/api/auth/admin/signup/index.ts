import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  if (req.method === "POST") {
    const secret = process.env.NEXT_PRIVATE_SECRET_PASS_KEY;
    const hashPass = () => {
      const salted = password + secret;
      const hash = bcrypt.hashSync(salted, 16);
      return hash;
    };
    try {
      await prisma.admin.create({ data: { username, password: hashPass() } });
      res.status(200).send("register admin successfully!");
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Internal server error!",
        error,
      });
    }
  } else {
    return res.status(405).send("Method not allowed!");
  }
};

export default handler;
