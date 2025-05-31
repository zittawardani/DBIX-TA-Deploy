import EmailIcon from "@/components/ui/icons/email";
import FacebookIcon from "@/components/ui/icons/facebook";
import InstagramIcon from "@/components/ui/icons/instagram";
import LocationIcon from "@/components/ui/icons/location";
import TeleponeIcon from "@/components/ui/icons/telepon";
import YoutubeIcon from "@/components/ui/icons/youtube";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">E-Shop DBI</h2>
          <p>
            PT. Digital Blockchain Indonesia adalah Perusahaan yang bergerak di
            Bidang Software Development dan Aplication IOS Android Mobile
            Berbasis blockchain
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Company</h3>
          <ul>
            <Link href={"/aboutus"}>
              <li className="mb-2 hover:underline">About Us</li>
            </Link>
            <Link href={"/team"}>
              <li className="mb-2 hover:underline">Our Team</li>
            </Link>
            <Link href={"/terms"}>
              <li className="mb-2 hover:underline">Terms & Privacy</li>
            </Link>
            <Link href={"/#faqs"}>
              <li className="mb-2 hover:underline">FAQ</li>
            </Link>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Our Office</h3>
          <ul>
            <li className="mb-2 flex items-center">
              <span role="img" aria-label="email" className="mr-2">
                <EmailIcon />
              </span>
              digitalblockchainindonesia@gmail.com
            </li>
            <li className="mb-2 flex items-center">
              <span role="img" aria-label="location" className="mr-2">
                <LocationIcon />
              </span>
              Jalan Sutawijaya No 89 Kelurahan Sumberrejo Kecamatan Banyuwangi
              Kabupaten Banyuwangi 68419 Jawa Timur Indonesia
            </li>
            <li className="mb-2 flex items-center">
              <span role="img" aria-label="phone" className="mr-2">
                <TeleponeIcon />
              </span>
              +6287863005800 | +6281336494664
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Social</h3>
          <ul className="flex space-x-4">
            <li>
              <a href="https://www.facebook.com/" className="hover:underline">
                <div className=" bg-white rounded-sm size-6">
                  <FacebookIcon />
                </div>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/" className="hover:underline">
                <div className="bg-white rounded-sm size-6">
                  <YoutubeIcon />
                </div>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/" className="hover:underline">
                <div className="bg-white rounded-sm size-6">
                  <InstagramIcon />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-sm lg:text-base pb-5 text-center w-full border-t pt-10 border-text/20">
        Copyright © 2024 by PT. Digital Blockchain Indonesia
      </div>
    </footer>
  );
};

export default Footer;
