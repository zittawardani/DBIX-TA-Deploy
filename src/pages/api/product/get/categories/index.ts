import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query
  try {
    const data = await prisma.product.findMany({ where: { category: String(name) } })
    res.send(data)
  } catch (error) {

  }
};

export default handler;