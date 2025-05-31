import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import bussinessAnimation from '../../../../public/animations/business-team.json'

const Hero = () => {
  return (
    <div className="w-full justify-between flex items-center lg:gap-10 gap-3 lg:flex-row flex-col-reverse lg:pb-0 pb-10">
      <div className="lg:w-1/2 w-full flex justify-start items-center">
        <div className="flex flex-col gap-6 py-10">
          <h1 className="text-6xl font-semibold lg:text-left text-center lg:py-4">
            E-Shop DBI
          </h1>
          <p className="lg:text-left text-center leading-normal text-gray-500 ">
            PT. Digital Blockchain Indonesia focuses on developing state-of-the-art mobile applications for iOS and Android 
            that utilize blockchain technology. Working together with the knowledgeable staff at Mudapedia, 
            we are excited to develop a potent web-based e-commerce platform. Our creative method creates safe, effective, 
            and scalable solutions that spur development and digital transformation by fusing blockchain technology with user-centric design.
          </p>
          <div className="flex justify-center gap-3 lg:justify-normal lg:py-4">
            <Link href={"/#products"}>
              <Button size={"default"}>Products</Button>
            </Link>
            <Link href={"/aboutus"}>
              <Button size={"default"}>About Us</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 flex lg:justify-center justify-center items-center lg:h-[65vh] md:h-[65vh] h-[40vh] overflow-hidden">
        <Lottie animationData={bussinessAnimation} />
      </div>
    </div>
  );
};

export default Hero;
