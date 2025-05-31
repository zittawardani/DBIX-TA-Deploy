"use client";
import React, { useEffect } from "react";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import mudapedia from "@/utils/mudapedia";
import { ContractDataType } from "@/types/contractDataTypes";

// Styling dokumen
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    lineHeight: 1.5,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  headerContainerText: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },

  textHeaderBold: {
    fontSize: 20,
    fontWeight: "bold",
  },

  textHeaderSmall: {
    fontSize: 10,
  },
  logo: {
    width: 80,
    height: 80,
  },

  textLink: {
    color: "blue",
    textDecoration: "underline",
  },

  title: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textDecoration: "underline",
    textTransform: "uppercase",
  },

  pasal: {
    marginTop: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  text: {
    width: "100%",
    textAlign: "justify",
  },

  bold: {
    fontWeight: "bold",
  },

  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    marginLeft: 20,
  },

  listNumber: {
    width: 20,
  },

  listText: {
    flex: 1,
    fontSize: 12,
  },

  marginLeft20: {
    marginLeft: 20,
  },

  marginLeft40: {
    marginLeft: 40,
  },

  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  spacer: {
    height: 20,
  },
  signature: {},
  featureItem: { marginBottom: 2 },
  listBullet: { fontWeight: "bold" },
});

const ContractPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        <Image style={styles.logo} src={mudapedia} />
        <View style={styles.headerContainerText}>
          <Text style={styles.textHeaderBold}>
            PT. MUDAPEDIA DIGITAL INDONESIA
          </Text>
          <Text>One Stop Business and IT Solution</Text>
          <Text style={styles.textHeaderSmall}>
            Jl. Sutawijaya No.89, Sumberrejo, Kec. Banyuwangi, Kabupaten
            Banyuwangi, Jawa Timur
          </Text>
          <Text style={styles.textHeaderSmall}>
            Website :{" "}
            <Text style={styles.textLink}>https://mudapedia.my.id</Text> – Email
            : muudapedia@gmail.com
          </Text>
        </View>
      </View>
      <Text style={styles.title}>
        KONTRAK PERJANJIAN PEMBUATAN PERANGKAT LUNAK
      </Text>
      <Text style={styles.bold}>Nomor:</Text>

      <Text style={styles.bold}>Pihak yang terlibat:</Text>
      <View style={styles.listItem}>
        <Text style={styles.listNumber}>1.</Text>
        <Text style={styles.listText}>
          <Text style={styles.bold}>Pihak Pertama</Text>, selaku pihak yang
          memesan perangkat lunak.
        </Text>
      </View>
      <Text style={[styles.marginLeft40, styles.bold]}>
        Nama : {data?.fullName ?? "-"}
      </Text>
      <Text style={[styles.marginLeft40, styles.bold]}>
        Alamat : {data?.address ?? "-"}
      </Text>

      <View style={styles.listItem}>
        <Text style={styles.listNumber}>2.</Text>
        <Text style={styles.listText}>
          <Text style={styles.bold}>Pihak Kedua</Text>, selaku pihak yang
          mengembangkan perangkat lunak.
        </Text>
      </View>
      <Text style={[styles.marginLeft40, styles.bold]}>Nama : Ramzi Daffa</Text>
      <Text style={[styles.marginLeft40, styles.bold]}>
        Alamat : Jl. Sutawijaya No.89
      </Text>

      <Text style={styles.text}>
        Masing – masing pihak telah sepakat untuk mengadakan perjanjian
        kerjasama dengan ketentuan - ketentuan dan syarat – syarat yang diatur
        dalam 7 pasal sebagai berikut:
      </Text>

      {/* Pasal-pasal */}
      <Text style={styles.pasal}>Pasal 1 - Ruang Lingkup Pekerjaan</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Pihak Kedua</Text> setuju untuk mengembangkan
        perangkat lunak dengan spesifikasi berikut:
      </Text>
      <Text style={styles.marginLeft20}>
        <Text style={styles.listNumber}>1.</Text>Nama proyek :{" "}
        {data?.contractName ?? "-"}
      </Text>
      <Text style={styles.marginLeft20}>
        <Text style={styles.listNumber}>2.</Text>Deskripsi proyek :
        {data?.descriptionContract ?? "-"}
      </Text>
      <Text style={styles.marginLeft20}>
        <Text style={styles.listNumber}>3.</Text>Platform :{" "}
      </Text>
      <Text style={styles.marginLeft20}>
        <Text style={styles.listNumber}>4.</Text>Teknologi yang digunakan :{" "}
      </Text>
      <Text style={styles.marginLeft20}>
        <Text style={styles.listNumber}>5.</Text>Scope of Work :
        {data?.scopeOfWork ?? "-"}
      </Text>
      <Text style={styles.marginLeft20}>
        <Text style={styles.listNumber}>6.</Text> Fitur utama :
      </Text>
      {data?.features?.length > 0 ? (
        data.features.map((feature: string, i: number) => (
          <Text key={i} style={[styles.marginLeft40, styles.featureItem]}>
            <Text style={styles.listBullet}>{`${i + 1}. `}</Text>
            {feature}
          </Text>
        ))
      ) : (
        <Text style={styles.marginLeft40}>-</Text>
      )}

      <Text style={styles.pasal}>Pasal 2 - Jangka Waktu Pengerjaan</Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>1.</Text>Pengerjaan dimulai pada tanggal{" "}
        {data?.startDate ?? "-"}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>2.</Text>Pengerjaan harus selesai dengan
        estimasi tanggal selesai {data?.endDate ?? "-"}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>3.</Text> Jika terdapat keterlambatan
        yang bukan karena kesalahan <Text style={styles.bold}>Pihak Kedua</Text>
        , maka jadwal dapat diperpanjang dengan persetujuan bersama.{" "}
      </Text>

      <Text style={styles.pasal}>Pasal 3 - Biaya dan Pembayaran</Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>1.</Text>Total biaya pengerjaan
        perangkat lunak adalah {data?.cost ?? "-"}.
      </Text>

      <Text style={styles.pasal}>Pasal 4 - Hak dan Kewajiban</Text>

      <Text style={styles.text}>
        <Text style={styles.listNumber}>1.</Text>
        <Text style={styles.bold}>Pihak Pertama</Text> berkewajiban memberikan
        spesifikasi yang jelas dan memberikan umpan balik tepat waktu.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>2.</Text>
        <Text style={styles.bold}>Pihak Kedua</Text> berkewajiban menyelesaikan
        proyek sesuai dengan spesifikasi dan jadwal yang telah disepakati.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>3.</Text>
        Hak kekayaan intelektual atas perangkat lunak ini menjadi milik{" "}
        <Text style={styles.bold}>Pihak Pertama</Text> setelah pembayaran
        selesai.
      </Text>

      <Text style={styles.pasal}>Pasal 5 - Garansi dan Pemeliharaan</Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>1.</Text>
        <Text style={styles.bold}>Pihak Kedua</Text> memberikan garansi selama 2
        minggu setelah proyek selesai.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>2.</Text>
        Perbaikan bug yang ditemukan dalam masa garansi akan ditangani tanpa
        biaya tambahan.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>3.</Text>
        Jika diperlukan pemeliharaan tambahan setelah masa garansi, biaya akan
        dinegosiasikan kembali.
      </Text>

      <Text style={styles.pasal}>
        Pasal 6 - Pembatalan dan Penyelesaian Sengketa
      </Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>1.</Text>
        Jika salah satu pihak ingin membatalkan kontrak sebelum selesai, maka
        harus memberikan pemberitahuan tertulis dalam waktu 7 hari sebelumnya.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.listNumber}>2.</Text>
        Penyelesaian sengketa yang tidak dapat diselesaikan secara musyawarah
        akan diselesaikan melalui jalur hukum yang berlaku di Banyuwangi.
      </Text>

      {/* Tanda tangan */}
      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <Text>Pihak Pertama</Text>
          {data?.signature && (
            <Image style={styles.signature} src={data?.signature} />
          )}
          <View style={styles.spacer} />
          <Text>{data?.fullName ?? "-"}</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text>Pihak Kedua</Text>
          {data?.adminSignature && (
            <Image style={styles.signature} src={data?.adminSignature} />
          )}
          <View style={styles.spacer} />
          <Text>Ramzi Daffa</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ContractPDF;
