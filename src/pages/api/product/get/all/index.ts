import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await prisma.product.findMany()
        res.send(data)
    } catch (error) {
        console.log(error)
        res.json({
            msg: "Error",
            error
        })
    }
}

export default handler