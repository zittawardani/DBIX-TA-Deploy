import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo.png" />
        <meta
          name="description"
          content="PT. Digital Blockchain Indonesia focuses on developing state-of-the-art mobile applications for iOS and Android that utilize blockchain technology. Working together with the knowledgeable staff at Mudapedia, we are excited to develop a potent web-based e-commerce platform. Our creative method creates safe, effective, and scalable solutions that spur development and digital transformation by fusing blockchain technology with user-centric design."
          key={"desc"}
        />
        <meta
          property="og:description"
          content="PT. Digital Blockchain Indonesia focuses on developing state-of-the-art mobile applications for iOS and Android that utilize blockchain technology. Working together with the knowledgeable staff at Mudapedia, we are excited to develop a potent web-based e-commerce platform. Our creative method creates safe, effective, and scalable solutions that spur development and digital transformation by fusing blockchain technology with user-centric design."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
