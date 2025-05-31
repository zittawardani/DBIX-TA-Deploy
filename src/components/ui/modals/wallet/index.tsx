import React, { useState } from "react";
import { Loader, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

declare global {
  interface Window {
    unisat?: {
      requestAccounts: () => Promise<string[]>;
    };
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
      };
    };
  }
}

interface ModalSelectWalletProps {
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  isOpen: boolean;
  onClose: () => void;
}

const ModalSelectWallet: React.FC<ModalSelectWalletProps> = ({
  setConnected,
  setAccounts,
  isOpen,
  onClose,
}) => {
  const [load, setLoad] = useState(false);
  const [walletType, setWalletType] = useState<"unisat" | "phantom" | null>(null);

  const handleConnectUnisat = async () => {
    setWalletType("unisat");
    console.log("handleConnect triggered");

    if (typeof window.unisat === "undefined") {
      console.log("Unisat wallet extension not detected");
      toast.error(
        "Unisat wallet extension not detected. Please install it and refresh the page.",
        { duration: 3000 }
      );
      setTimeout(() => {
        console.log("Redirecting to Unisat wallet extension page");
        window.open(
          "https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo?hl=en-US",
          "_blank"
        );
      }, 3000);
    } else {
      try {
        console.log("Unisat wallet detected, requesting accounts");
        setLoad(true);
        const accounts = await window.unisat.requestAccounts();
        console.log("Accounts retrieved:", accounts);
        toast.success("Unisat wallet has been connected!", { duration: 2000 });
        setConnected(true);
        setAccounts(accounts);
        setLoad(false);
        onClose();
      } catch (error: any) {
        setLoad(false);
        console.error("Error during wallet connection:", error);
        if (error.code === 4001) {
          toast.error("Request canceled!", { duration: 2000 });
        } else {
          toast.error(`An error occurred: ${error.message}`, {
            duration: 2000,
          });
        }
      }
    }
  };

  const handleConnectPhantom = async () => {
    setWalletType("phantom");
    if (!window.phantom?.solana?.isPhantom) {
      toast.error("Phantom wallet not detected. Please install it.", {
        duration: 3000,
      });
      setTimeout(() => {
        window.open(
          "https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
          "_blank"
        );
      }, 3000);
      return;
    }

    try {
      setLoad(true);
      const resp = await window.phantom.solana.connect();
      const account = resp.publicKey.toString();
      toast.success("Phantom wallet connected!");
      setConnected(true);
      setAccounts([account]);
      setLoad(false);
      onClose();
    } catch (error: any) {
      console.error("Phantom connection failed:", error);
      toast.error(`Failed to connect Phantom: ${error.message}`, {
        duration: 2000,
      });
      setLoad(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-sm bg-white rounded-md p-6 flex flex-col items-center justify-center">
        {load ? (
          <div className="flex flex-col gap-3">
            <div className="w-full flex flex-col items-center gap-2">
              {walletType === "unisat" && (
                <>
                  <img
                    src="https://next-cdn.unisat.io/_/271/logo/color.svg"
                    alt="Unisat"
                    width={30}
                    height={30}
                  />
                  <span>Unisat Wallet</span>
                </>
              )}
              {walletType === "phantom" && (
                <>
                  <img
                    src="https://187760183-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MVOiF6Zqit57q_hxJYp%2Ficon%2FU7kNZ4ygz4QW1rUwOuTT%2FWhite%20Ghost_docs_nu.svg?alt=media&token=447b91f6-db6d-4791-902d-35d75c19c3d1"
                    alt="Phantom"
                    width={30}
                    height={30}
                  />
                  <span>Phantom Wallet</span>
                </>
              )}
            </div>
            <div className="flex items-center w-full gap-2 justify-center">
              <Loader size={24} className="animate-spin-slow" />
              <p className="font-mono">Connecting...</p>
            </div>
            <button className="text-text/50 hover:text-text" onClick={onClose}>
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              className="absolute top-3 right-3 hover:text-red-500 transition-colors duration-200"
              onClick={onClose}
            >
              <X size={24} />
            </button>
            <DialogHeader>
              <DialogTitle className="font-semibold">
                Select a wallet
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="flex flex-col gap-5 w-full">
              <button
                className="w-full rounded-md border border-text/15 p-3 flex items-center gap-2 hover:border-primary/15 hover:bg-primary/10 transition-colors duration-200"
                onClick={handleConnectUnisat}
              >
                <img
                  src="https://next-cdn.unisat.io/_/271/logo/color.svg"
                  alt="Unisat wallet"
                  width={30}
                  height={30}
                />
                Unisat Wallet
              </button>
              <button
                className="w-full rounded-md border border-text/15 p-3 flex items-center gap-2 hover:border-primary/15 hover:bg-primary/10 transition-colors duration-200"
                onClick={handleConnectPhantom}
              >
                <img
                  src="https://187760183-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MVOiF6Zqit57q_hxJYp%2Ficon%2FU7kNZ4ygz4QW1rUwOuTT%2FWhite%20Ghost_docs_nu.svg?alt=media&token=447b91f6-db6d-4791-902d-35d75c19c3d1"
                  alt="Phantom wallet"
                  width={30}
                  height={30}
                />
                Phantom Wallet
              </button>
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalSelectWallet;
