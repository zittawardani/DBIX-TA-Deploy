import generateInvoiceId from "@/utils/generateInvoiceId";
import xendit from "@/utils/xendit";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { amount, description, items } = req.body;

  if (req.method === "POST") {
    try {
      const data = {
        amount,
        invoiceDuration: "172800",
        externalId: generateInvoiceId(),
        description,
        currency: "IDR",
        reminderTime: 1,
        items,
      };
      const create = await xendit.Invoice.createInvoice({ data });
      res.status(200).send({ data: create });
    } catch (error) {
      res.status(500).json({
        msg: "Internal server error!",
        error,
      });
    }
  } else {
    res.status(405).send("method not allowed!");
  }
};

export default handler;
