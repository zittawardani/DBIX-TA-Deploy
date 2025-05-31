import CodeIcon from "@/components/ui/icons/code";
import MedalIcon from "@/components/ui/icons/medal";
import TrophyIcon from "@/components/ui/icons/trophy";
import React from "react";
import dynamic from "next/dynamic";
import bussinessAnimation from "../../../../public/animations/business-sales-profit.json";

// Lottie pakai dynamic import agar tidak SSR!
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const ChooseUs = () => {
  return (
    <div className="flex flex-col items-center lg:p-8 lg:flex-row gap-10">
      <div className="w-full lg:w-1/2 md:w-2/3 flex justify-center mb-8 md:mb-0">
        <Lottie animationData={bussinessAnimation} style={{ height: 280 }} />
      </div>
      <div className="w-full lg:w-1/2">
        <h1 className="text-4xl font-semibold mb-4 lg:text-5xl">
          Why Choose Us
        </h1>
        <p className="text-lg mb-5 text-gray-600">
          Get to Know Our Company Better
        </p>
        <p className="mb-4 text-gray-600 text-lg lg:text-lg">
          Customer satisfaction is our top priority. We continuously strive to
          improve the quality of our services to meet your evolving needs.
        </p>
        <div className="space-y-8">
          <div className="flex items-start">
            <div className="mr-4">
              <TrophyIcon />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Professional</h2>
              <p className="text-gray-600 text-lg">
                Our team consists of experienced professionals who are committed
                to providing the best solutions for every client.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-4">
              <CodeIcon />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Using the Latest Technology
              </h2>
              <p className="text-gray-600 text-lg">
                We always strive to introduce the latest innovations in the
                industry through the utilization of technology. With this, you
                can obtain solutions that are not only effective but also
                innovative.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-4">
              <MedalIcon />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Best Service</h2>
              <p className="text-gray-600 text-lg">
                Customer satisfaction is our ultimate goal. We are committed to
                providing the best service and exceeding your expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseUs;
