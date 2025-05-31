type Currency = "USD" | "IDR";
type Crypto = "BTC" | "ETH" | "SOL" | "USDT" | "BNB" | "USDC";

// Contoh nilai tukar (harus diperbarui secara real-time melalui API)
const exchangeRates: Record<Crypto, number> = {
  BTC: 1_415_499_469.17, // 1 BTC ≈ 1M 415juta IDR (contoh, bisa berubah sesuai market coin)
  ETH: 33_408_015.96,  // 1 ETH ≈ 33 juta IDR
  SOL: 2_204_514.65,   // 1 SOL ≈ 2 juta IDR
  USDT: 16_000,     // 1 USDT ≈ 16 ribu IDR
  BNB: 10_338_113.96,   // 1 BNB ≈ 10 juta IDR
  USDC: 16_000,     // 1 USDC ≈ 16 ribu IDR
};

// Fungsi untuk format harga fiat (USD, IDR)
const formatPrice = (locales: string, price: number, currency: Currency): string => {
  const formatter = new Intl.NumberFormat(locales, { style: "currency", currency });
  return formatter.format(price);
};

// Fungsi konversi dari IDR ke Crypto
const convertToCrypto = (priceIDR: number, crypto: Crypto): string => {
  const rate = exchangeRates[crypto];
  if (!rate) return "Invalid Crypto";

  const converted = priceIDR / rate; // Konversi IDR ke mata uang crypto
  return `${converted.toFixed(8)} ${crypto}`; // Menampilkan hingga 8 desimal seperti format crypto
};

// Objek untuk pemformatan harga
const formattedPrice = {
  toUSD: (price: number): string => formatPrice("en-US", price, "USD"),
  toIDR: (price: number): string => formatPrice("id-ID", price, "IDR"),
  toCrypto: (priceIDR: number, crypto: Crypto): string => convertToCrypto(priceIDR, crypto),
};

export default formattedPrice;
