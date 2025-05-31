import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next"
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const data = await prisma.orders.findMany()
        console.log(data)
        res.status(200).json(data)
       
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Data User Error!'})
    }

}
 
export default handler; 