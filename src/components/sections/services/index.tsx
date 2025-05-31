import { CheckCircle } from "lucide-react";
import React from "react";

const Services = () => {
  return (
    <div id="services" className="py-5 lg:py-0">
      <h1 className="text-center text-2xl lg:text-5xl font-semibold leading-8 ">
        Our Services
      </h1>
      <p className="text-[#455A64] text-center font-extralight mt-4">
        Providing manufacturing services
      </p>
      <div className="grid lg:grid-cols-2 grid-cols-2 gap-[54px] lg:px-[258px] mt-16 ">
        <ul className="flex flex-col gap-[14px]">
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Website</span>
          </li>
          <li className="flex lg:gap-8 gap-3 text-sm lg:text-base font-semibold">
            <CheckCircle />
            <span>Web 3</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Android Application</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>IOS Application</span>
          </li>
        </ul>
        <ul className="flex flex-col gap-[14px] ">
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Blockchain Service</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Bussiness Platform</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Gaming Exchange Based Token</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Payment Gateway</span>
          </li>
        </ul>
        <ul className="flex flex-col gap-[14px] ">
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Decentralized Exchange</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Internet of Things (IOT)</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Create Robot Trading</span>
          </li>
        </ul>
        <ul className="flex flex-col gap-[14px] ">
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Exchanger Platform</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>Android Exchange</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>IOS Exchange</span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>NFT Platform</span>
          </li>
        </ul>
        <ul className="flex flex-col gap-[14px] ">
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>(COIN) - Sha 256 </span>
          </li>
          <li className="flex text-sm lg:text-base lg:gap-8 gap-3 font-semibold">
            <CheckCircle />
            <span>(TOKEN) - ERC 20, BSC 20, TRC 20</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Services;
