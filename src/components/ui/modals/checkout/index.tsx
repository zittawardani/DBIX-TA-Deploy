import React, { useState, useCallback, SetStateAction, Dispatch } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../dialog";
import { Button } from "../../button";
import { ProductDataType } from "@/types/productDataTypes";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Image as ImageIcon,
  Copy,
  Wallet,
  Check,
  X,
  Upload,
} from "lucide-react";
import formattedPrice from "@/utils/formattedPrice";
import generateInvoiceId from "@/utils/generateInvoiceId";
import { motion, AnimatePresence } from "framer-motion";
import ModalSelectWallet from "@/components/ui/modals/wallet";

// PaymentProofModal Component
interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: File[];
  setImage: Dispatch<SetStateAction<File[]>>;
  handlePostOrder: () => void;
}

const PaymentProofModal = ({
  isOpen,
  onClose,
  image,
  setImage,
  handlePostOrder,
}: PaymentProofModalProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles[0]) {
        if (!acceptedFiles[0].type.startsWith("image/")) {
          alert("Please upload an image file.");
          return;
        }
        setImage(acceptedFiles);
      }
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-96 flex flex-col items-center shadow-lg relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="text-lg font-bold mb-4">Upload Payment Proof</h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 w-full text-center cursor-pointer ${
                isDragActive ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                {image.length > 0 ? (
                  <p className="text-gray-500">{image[0].name}</p>
                ) : (
                  <>
                    <p className="text-gray-600">Attach File</p>
                    <p className="text-gray-400 text-xs">or drag and drop</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full mt-6">
              <Button
                onClick={() => {
                  handlePostOrder();
                  onClose();
                }}
                className="w-full"
              >
                Submit
              </Button>
              <Button onClick={onClose} variant="secondary" className="w-full">
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// CryptoDetailsModal Component
const CryptoDetailsModal = ({
  isOpen,
  onClose,
  selectedCryptoData,
  product,
  openUploadModal,
  onPay,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedCryptoData: {
    name: string;
    logo: string;
    address: string;
    qr: string;
  };
  product: ProductDataType;
  openUploadModal: () => void;
  onPay: () => void;
}) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const { push } = useRouter();

  const handleDisconnect = () => {
    setIsConnected(false);
    setAccounts([]);
    toast.success("Wallet disconnected!");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-6 rounded-lg w-[600px] max-w-lg text-center mx-auto">
        <motion.div
          initial={{ x: 500, opacity: 0 }} // Mulai dari luar layar (kanan)
          animate={{ x: 0, opacity: 1 }} // Masuk ke tengah
          exit={{ x: 500, opacity: 0 }} // Keluar ke kanan
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative bg-white p-6 rounded-lg shadow-lg w-full"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              Detail Payment Crypto by {selectedCryptoData.name}
            </DialogTitle>
          </DialogHeader>

          {/* Logo Crypto */}
          <div className="flex justify-center my-2">
            <img
              src={selectedCryptoData.logo}
              alt="Crypto Logo"
              className="w-14 h-14"
            />
          </div>

          {/* Detail Produk */}
          <p className="text-sm font-semibold">Product : {product.name}</p>
          <p className="text-sm font-semibold">
            Code Product : {product.code_product}{" "}
          </p>
          <p className="text-sm font-bold">
            TOTAL : {formattedPrice.toCrypto(product.price, "BTC")}
          </p>

          {/* QR Code */}
          <div className="flex justify-center my-3">
            <img
              src={selectedCryptoData.qr}
              alt="QR Code"
              className="w-28 h-28"
            />
          </div>

          {/* Address Box */}
          <div className="bg-[#0E111B] text-white p-3 rounded-md text-center text-sm font-mono">
            {selectedCryptoData.address}
            <button
              className="bg-gray-700 text-white px-3 py-1 rounded-md flex items-center mx-auto mt-2"
              onClick={() => {
                navigator.clipboard.writeText(selectedCryptoData.address);
                alert("Address copied to clipboard!");
              }}
            >
              <Copy className="w-4 h-4 mr-1" /> Copy
            </button>
          </div>

          {/* Tombol Connect Wallet & Pay */}
          <div className="flex flex-col items-center gap-2 mt-4">
            {isConnected ? (
              <>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 text-white px-6 py-2 rounded-md w-48 flex items-center justify-center gap-x-2"
                >
                  <X className="w-5 h-5" />
                  Disconnect
                </button>
                {/* Wallet address muncul jika terhubung */}
                {accounts.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2 break-all text-center w-48">
                    Connected Wallet: <br /> {accounts[0]}
                  </p>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="bg-[#0E111B] text-white px-6 py-2 rounded-md w-48 flex items-center justify-center gap-x-2"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  openUploadModal();
                }, 300);
              }}
              className="bg-[#0E111B] hover:bg-[#1a1e2e] active:scale-95 transition-all duration-200 text-white px-6 py-2 rounded-md w-48 flex items-center justify-center gap-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Payment Proof</span>
            </button>
          </div>
        </motion.div>
      </DialogContent>
      {showWalletModal && (
        <ModalSelectWallet
          setConnected={setIsConnected}
          setAccounts={setAccounts}
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </Dialog>
  );
};

// ModalCheckout Component
const ModalCheckout = ({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ProductDataType;
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { toast } = useToast();
  const fee = data.price && data.price * 0.004;
  const tax = 0.05;
  const appFee = 0.002;
  const total = data.price + (fee + data.price * tax + data.price * appFee);
  const [load, setLoad] = useState(false);
  const { data: session, status }: any = useSession();
  const { push } = useRouter();
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [image, setImage] = useState<File[]>([]);
  const [showCryptoDetails, setShowCryptoDetails] = useState(false);
  const [selectedCryptoData, setSelectedCryptoData] = useState({
    name: "",
    logo: "",
    address: "",
    qr: "",
  });
  const [isTransactionSuccessOpen, setTransactionSuccessOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaa", data);

  const cryptoData = [
    {
      name: "BTC",
      logo: "https://www.cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040",
      address: "tb1qtc0l0uz60k7rzlg7jwpq2u90k97vdfsewr3qdl",
      qr: "https://res.cloudinary.com/dxbcdfojc/image/upload/v1742051801/DBI/QRCode_BTC_Testnet.png",
    },
    {
      name: "ETH",
      logo: "https://www.cryptologos.cc/logos/ethereum-eth-logo.svg?v=040",
      address: "0x44AF940ac6c2f45D230B0b6Eb8C686Af4c4dBB4B",
      qr: "https://res.cloudinary.com/dxbcdfojc/image/upload/v1741579853/DBI/QRCode_ETH.png",
    },
    {
      name: "SOL",
      logo: "https://www.cryptologos.cc/logos/solana-sol-logo.svg?v=040",
      address: "HcBoVzYXFb4H3ftUjCykN1wcSiL1Eo8Cy8cgDeKAH1qj",
      qr: "https://res.cloudinary.com/dxbcdfojc/image/upload/v1742055907/DBI/QRCode_SOL_testnet.png",
    },
    {
      name: "BNB",
      logo: "https://www.cryptologos.cc/logos/bnb-bnb-logo.svg?v=040",
      address: "bc1qtc0l0uz60k7rzlg7jwpq2u90k97vdfsey92nkv",
      qr: "",
    },
    {
      name: "USDT",
      logo: "https://www.cryptologos.cc/logos/tether-usdt-logo.svg?v=040",
      address: "-",
      qr: "",
    },
    {
      name: "USDC",
      logo: "https://www.cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040",
      address: "-",
      qr: "",
    },
  ];

  const clickedCrypto = (name: string) => {
    const selected: any = cryptoData.find((item) => item.name === name);
    setSelectedCryptoData(selected);
    setShowCryptoModal(false);
    setShowCryptoDetails(true);
  };

  const handlePay = () => {
    setTransactionSuccessOpen(true);
  };
  // TransactionSuccessDialog Component
  const TransactionSuccessDialog = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    const router = useRouter();

    const handleBackToHome = () => {
      onClose();
      router.push("/"); // Arahkan ke halaman home
    };

    const handleViewOrder = () => {
      onClose();
      router.push("/user/profile"); // Redirect ke halaman order
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[360px] rounded-xl px-6 py-8 flex flex-col items-center justify-start gap-6">
          {/* Icon */}
          <div className="w-[70px] h-[70px] rounded-full border-[6px] border-gray-200 flex items-center justify-center shadow-sm">
            <div className="w-[52px] h-[52px] bg-[#6EC19A] rounded-full flex items-center justify-center">
              <Check className="text-white w-6 h-6 stroke-[3px]" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mt-2">
            <h2 className="text-base font-semibold text-black">
              Transactions Success!
            </h2>
            <p className="text-gray-700 text-sm mt-1">
              Congratulations! Your transaction <br />
              completed successfully.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-6 w-full items-center">
            <Button
              className="bg-[#0E111B] text-white w-[300px] h-10 rounded-md text-sm font-medium"
              onClick={handleBackToHome}
            >
              Back to home
            </Button>
            <Button
              className="bg-[#0E111B] text-white w-[300px] h-10 rounded-md text-sm font-medium"
              onClick={handleViewOrder}
            >
              View order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleDebitCardPayment = async () => {
    if (status === "authenticated") {
      const bodyXendit = {
        amount: total,
        description: `Payout for ${data.name} on the marketplace dbix.my.id`,
        items: [{ name: data.name, quantity: 1, price: data.price }],
      };
      setLoad(true);
      try {
        const resp = await axios.post(
          "/api/payment/create-checkout",
          bodyXendit
        );
        if (resp.status === 200) {
          setLoad(false);
          toast({
            description: "Invoice created. Please upload payment proof!",
          });

          // Buka upload payment proof modal
          setShowUploadModal(true);

          setTimeout(() => {
            window.open(resp.data.data.invoiceUrl, "_blank");
          }, 500);
        } else {
          toast({
            description: "Creating invoice Failed!",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log(error);
        setLoad(false);
        toast({ description: "Server error!", variant: "destructive" });
      }
    } else {
      toast({
        title: "Oops!",
        description: "You must login to continue!",
        variant: "destructive",
      });
      setTimeout(() => {
        push("/user/login");
      }, 1500);
    }
  };

  const handlePostOrder = async () => {
    const convertFileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };
    if (image && image[0]) {
      try {
        const base64Image = await convertFileToBase64(image[0]);

        const bodyOrder = {
          orderId: `CARD-${generateInvoiceId()}`,
          products: [{ id: data.code_product, qty: 1 }],
          userId: [String(session?.user.id)],
          paymentProof: base64Image,
          paymentMethods: paymentMethod,
        };

        await axios.post("/api/order/post", bodyOrder);

        alert("Order berhasil dikirim!");
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat mengirim order.");
      }
    } else {
      alert("Please provide an image!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex justify-between gap-5">
        <DialogHeader className="w-1/2">
          <DialogTitle>
            <img
              src={data.image[0]}
              alt={data.name}
              className="w-full h-[26rem] object-cover rounded-md"
            />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="w-1/2 flex flex-col gap-5">
          <h1 className="">Transaction confirmation</h1>
          <div className="flex w-full flex-col gap-1">
            <h1 className="text-black font-bold text-xl first-letter:uppercase">
              {data.name}
            </h1>
            <p className="font-medium capitalize text-gray-500">
              Variant :{" "}
              <span className="text-zinc-950 font-bold">
                {data.variants[0]}
              </span>
            </p>
          </div>
          <p>{data.desc}</p>
          <div className="flex flex-col gap-5">
            <div className="pb-2 border-b w-full justify-between flex">
              <h1 className="text-sm">Transaction fee :</h1>
              <p className="text-sm">{formattedPrice.toIDR(fee)}</p>
            </div>
            <div className="pb-2 border-b w-full justify-between flex">
              <h1 className="text-sm">TAX :</h1>
              <p className="text-sm">
                {tax * 100}% ({formattedPrice.toIDR(tax * data.price)})
              </p>
            </div>
            <div className="pb-2 border-b w-full justify-between flex">
              <h1 className="text-sm">Application fee :</h1>
              <p className="text-sm">
                {appFee * 100}% ({formattedPrice.toIDR(appFee * data.price)})
              </p>
            </div>
            <div className="pb-2 border-b w-full justify-between flex">
              <h1 className="text-xl font-bold text-black">TOTAL :</h1>
              <p className="text-sm text-black font-bold">
                {formattedPrice.toIDR(total)}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <h1>Payment methods</h1>
              <div className="flex items-center gap-3 justify-between w-full">
                <Button
                  size={"sm"}
                  className="w-full"
                  onClick={() => {
                    setShowCryptoModal(true);
                    setPaymentMethod("wallet");
                  }}
                >
                  Crypto currency
                </Button>
                <Button
                  size={"sm"}
                  className="w-full"
                  onClick={() => {
                    handleDebitCardPayment();
                    setPaymentMethod("card");
                  }}
                >
                  {load
                    ? "Creating Invoice...."
                    : "Debit cards and other payments"}
                </Button>
              </div>
            </div>
          </div>
          {showUploadModal && (
            <PaymentProofModal
              isOpen={showUploadModal}
              onClose={() => setShowUploadModal(false)}
              image={image}
              setImage={setImage}
              handlePostOrder={async () => {
                await handlePostOrder();
                setShowUploadModal(false); // Tutup upload modal
                setTransactionSuccessOpen(true); // Munculkan Transaction Success modal
              }}
            />
          )}
        </DialogDescription>
      </DialogContent>

      {showCryptoModal && (
        <Dialog
          open={showCryptoModal}
          onOpenChange={() => setShowCryptoModal(false)}
        >
          <DialogContent className="w-[400px] h-[450px] bg-white text-gray-900 p-6 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">
                Select a crypto wallet to proceed with payment
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex justify-center items-center gap-2"
                  onClick={() => clickedCrypto("BTC")}
                >
                  <img
                    src="https://www.cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040"
                    alt="BTC"
                    className="w-5 h-5"
                  />
                  BTC
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-center items-center gap-2"
                  onClick={() => clickedCrypto("ETH")}
                >
                  <img
                    src="https://www.cryptologos.cc/logos/ethereum-eth-logo.svg?v=040"
                    alt="ETH"
                    className="w-5 h-5"
                  />
                  Ethereum
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-center items-center gap-2"
                  onClick={() => clickedCrypto("SOL")}
                >
                  <img
                    src="https://www.cryptologos.cc/logos/solana-sol-logo.svg?v=040"
                    alt="Solana"
                    className="w-5 h-5"
                  />
                  Solana
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-center items-center gap-2"
                  onClick={() => clickedCrypto("BNB")}
                >
                  <img
                    src="https://www.cryptologos.cc/logos/bnb-bnb-logo.svg?v=040"
                    alt="BNB"
                    className="w-5 h-5"
                  />
                  BNB
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-center items-center gap-2"
                  onClick={() => clickedCrypto("USDT")}
                >
                  <img
                    src="https://www.cryptologos.cc/logos/tether-usdt-logo.svg?v=040"
                    alt="USDT"
                    className="w-5 h-5"
                  />
                  Tether USDT
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-center items-center gap-2"
                  onClick={() => clickedCrypto("USDC")}
                >
                  <img
                    src="https://www.cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040"
                    alt="USDC"
                    className="w-5 h-5"
                  />
                  USDC
                </Button>
              </div>
            </DialogDescription>
            <Button
              className="mt-4 w-full bg-gray-700"
              onClick={() => setShowCryptoModal(false)}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}

      <CryptoDetailsModal
        isOpen={showCryptoDetails}
        onClose={() => setShowCryptoDetails(false)}
        selectedCryptoData={selectedCryptoData}
        product={data}
        onPay={handlePay}
        openUploadModal={() => setShowUploadModal(true)}
      />

      {/* Dialog Transaksi Sukses */}
      <TransactionSuccessDialog
        isOpen={isTransactionSuccessOpen}
        onClose={() => setTransactionSuccessOpen(false)}
      />
    </Dialog>
  );
};
export default ModalCheckout;
