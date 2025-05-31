import React from "react";

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center lg:p-8 lg:flex-row ">
      <div className="w-full md:w-2/3 lg:w-1/2 flex justify-center mb-8 md:mb-0">
        <img
          src="/logo.png"
          alt=""
          className="lg:w-5/6 w-full h-full justify-center"
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h1 className="text-4xl font-semibold mb-4 lg:text-5xl ">
          Kenali perusahaan lebih dekat
        </h1>
        <p className="text-lg mb-5 text-gray-600">Tentang Kami</p>
        <div className="space-y-4">
          <p className="text-[#252525]">
            PT. Digital Blockchain Indonesia adalah Perusahaan yang bergerak di
            Bidang Software Development dan Aplication IOS Android Mobile
            Berbasis blockchain .
          </p>
          <p className="text-[#252525]">
            Kami bergerak berkolaborasi dengan Team Perusahaan Dari Mudapedia
            membangun Platform beserta web base berbasis Ecommerce .
          </p>
          <p className="text-[#252525]">
            Produk kami saat ini dapat dibeli langsung melalui website resmi perusahaan kami di{" "}
          <a href="https://dbix.my.id" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              https://dbix.my.id
          </a>.
          </p>
          <p className="text-[#252525]">
            Produk kami saat ini tersedia sebagai berikut Template Website
            Berbasis Web 3 , Crypto Blockchain Berbasis NFT , Aplikasi Kasir
            Berbasis Website , dan kami menerima jasa pembuatan Crypto Berbasis
            Blockchain di berbagai Jaringan termasuk kami menerima jasa
            pembuatan Exchanger untuk market Perusahaan berbasis Blockchain.
          </p>
          <p className="text-[#252525]">
            Perusahaan kami saat ini terdaftar resmi dan saat ini berkantor
            pusat di
          </p>
          <p className="text-[#252525]">
            Jalan Sutawijaya No 89 Kelurahan Sumberrejo Kecamatan Banyuwangi
            Kabupaten Banyuwangi 68419 Jawa Timur Indonesia
          </p>
          <p className="text-[#252525]">
          <strong>Email:</strong> digitalblockchainindonesia@gmail.com <br/>
          <strong>Phone:</strong> +6287863005800 | +6281336494664
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
