import React from "react";

const Contact = () => {
  return (
    <div className="w-full grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
      <div className="w-full flex justify-start items-center">
        <div className="flex flex-col gap-8">
          <h1 className="lg:text-6xl text-2xl font-semibold lg:text-left text-center">
            Contact Us Now!
          </h1>
          <p className="lg:text-lg text-sm lg:text-left text-center leading-normal text-[#455A64]">
            You can reach out to us anytime, anywhere, with ease. Once you
            submit the form, our team will promptly respond to your message.
          </p>
          <p className="lg:text-lg text-sm lg:text-left text-center leading-normal text-[#455A64]">
            We're here to answer all your project-related questions and provide
            the best solutions. Don’t hesitate to connect with our experts so we
            can help resolve your business challenges.
          </p>
          <ul>
            <li className="mb-2 flex items-center">
              <span role="img" aria-label="email" className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
                </svg>
              </span>
              digitalblockchainindonesia@gmail.com
            </li>
            <li className="mb-2 flex items-center">
              <span role="img" aria-label="location" className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
                </svg>
              </span>
              Jalan Sutawijaya No 89 Kelurahan Sumberrejo Kecamatan Banyuwangi
              Kabupaten Banyuwangi 68419 Jawa Timur Indonesia
            </li>
            <li className="mb-2 flex items-center">
              <span role="img" aria-label="phone" className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
                </svg>
              </span>
              +6287863005800 | +6281336494664
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.6229865106893!2d114.34893827505692!3d-8.24061209179255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd15abdd13e4fb5%3A0x1d2dcf43663aacf!2sJl.%20Sutawijaya%20No.89%2C%20Sumberrejo%2C%20Kec.%20Banyuwangi%2C%20Kabupaten%20Banyuwangi%2C%20Jawa%20Timur%2068419!5e0!3m2!1sen!2sid!4v1722494184473!5m2!1sen!2sid"
          width={600}
          height={450}
          className="rounded-md w-full"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default Contact;
