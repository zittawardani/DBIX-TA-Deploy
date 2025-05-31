import React from "react";
import CardFAQ from "../cardFAQ";
import { Accordion } from "@radix-ui/react-accordion";

interface itemDataTypes {
  title: string;
  indexValue: number;
  deskripsi: string;
}

const FAQItems = () => {
  return (
    <Accordion
      className="px-16 py-10 rounded-lg border border-[#D4CFCF] mt-[57px]"
      type="single"
      collapsible
      defaultValue="item-1"
    >
      <CardFAQ title="Title 1" indexValue={1} deskripsi="Kamu Imut" />
      <CardFAQ title="Title 2" indexValue={2} deskripsi="Kamu Imut" />
    </Accordion>
  );
};

export default FAQItems;
