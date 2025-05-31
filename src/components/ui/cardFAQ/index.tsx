import { FAQDataType } from "@/types/faqDataTypes";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import React, { useState } from "react";

const CardFAQ = ({ indexValue, title, deskripsi }: FAQDataType) => {
  const [value, setValue] = useState("value");

  return (
    <AccordionItem
      className={`border-none p-3 w-full ${
        value === `item-${indexValue}` ? "bg-secondary" : ""
      }`}
      value={`item-${indexValue}`}
    >
      <AccordionTrigger
        className="text-xl font-semibold"
        onClick={() => setValue(`item-${indexValue}`)}
      >
        {title}
      </AccordionTrigger>
      <AccordionContent className="text-[16px]">{deskripsi}</AccordionContent>
    </AccordionItem>
  );
};

export default CardFAQ;
