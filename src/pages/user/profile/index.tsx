import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { UserDataType } from "@/types/userDataTypes";
import { Badge } from "@/components/ui/badge";
import Head from "next/head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import {
  BookCheckIcon,
  CheckCircleIcon,
  CircleUserRound,
  ListChecks,
  LoaderCircle,
  LockKeyholeIcon,
  PenSquareIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import emailVerified from "../../../../public/animations/emailVerified.json";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductDataType } from "@/types/productDataTypes";
import { ItemDataType } from "@/types/itemsDataTypes";
import {
  calculateApplicationFee,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  calculateTransactionFee,
} from "@/utils/calcutale";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import SignaturePad from "@/components/ui/signature-pad";
import { useRouter } from "next/router";
import ModalCheckout from "@/components/ui/modals/checkout";
import ContractPDF from "@/pages/pdf";
import { pdf } from "@react-pdf/renderer";
import { ContractDataType } from "@/types/contractDataTypes";
import Image from "next/image";

const ProfilePage = ({
  items,
  setItems,
  products,
  setProducts,
}: {
  items: ItemDataType[];
  setItems: Dispatch<SetStateAction<ItemDataType[]>>;
  products: ProductDataType[];
  setProducts: Dispatch<SetStateAction<ProductDataType[]>>;
}) => {
  const { data: session, status }: any = useSession();
  const [load, setLoad] = useState(false);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditing1, setIsEditing1] = useState(false);
  const [user, setUser] = useState<UserDataType>({
    id: "",
    name: "",
    email: "",
    image: "",
    emailVerified: false,
    items: [],
    type: "",
    orders: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const [updated, setUpdated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameLoad, setNameLoad] = useState(false);
  const [emailLoad, setEmailLoad] = useState(false);

  const [contractData, setContractData] = useState<ContractDataType[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isSignature, setIsSignature] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] =
    useState<ContractDataType | null>(null);

  const [openCheckout, setOpenCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenCheckout = (productData: any) => {
    if (!productData.variants || !Array.isArray(productData.variants)) {
      console.error("Invalid product data:", productData);
      alert("Product data is invalid. Please try again.");
      return;
    }
    setSelectedProduct(productData);
    setOpenCheckout(true);
  };
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const router = useRouter();

  const getDataUser = async () => {
    setLoad(true);
    if (session?.user) {
      try {
        const resp = await axios(`/api/user/get/${session?.user.id}`);
        setUser(resp.data);
        setLoad(false);
      } catch (error) {
        setLoad(true);
        toast({
          title: "Uh Oh! 😒",
          description:
            "Failed to get user data. Please check your connection or contact the developer!",
          variant: "destructive",
        });
      }
    }
  };

  const getContractData = async () => {
    try {
      const resp = await axios(`/api/contract/get?userId=${user.id}`);
      setContractData(resp.data);
    } catch (err) {
      console.error("❌ Error fetching contract data:", err);
    }
  };

  useEffect(() => {
    if (!user.id) return;
    (async () => {
      await getContractData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleEditClick1 = () => {
    setIsEditing1(true);
  };

  useEffect(() => {
    getDataUser();
  }, [session?.user.id, updated]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = String(user.name);
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (inputRef1.current) {
      inputRef1.current.value = String(user.email);
      inputRef1.current.focus();
      inputRef1.current.select();
    }
  }, [isEditing1]);

  const handleSubmitName = async () => {
    if (session?.user) {
      setNameLoad(true);
      try {
        await axios.put(`/api/user/update/name/${String(session.user.id)}`, {
          name,
        });
        toast({
          title: "Success ✅",
          description: "The name has been updated!",
        });
        setNameLoad(false);
        setUpdated(!updated);
        setIsEditing(false);
      } catch (error) {
        setNameLoad(false);
        console.log(error);
      }
    }
  };

  // Handle preview PDF
  const handlePreview = (filename: string) => {
    if (!filename) return;
    setIsPreviewDialogOpen(true);
    const fileUrl = `http://localhost:3000/api/contract/pdf/get?filename=${filename}`;
    setPdfUrl(fileUrl);
  };

  const handleSendFeedback = async () => {
    if (!selectedContract) return;

    if (!feedback.trim()) {
      alert("Feedback tidak boleh kosong");
      return;
    }

    try {
      const res = await axios.post("/api/contract/post/feedback", {
        contractId: selectedContract.id,
        content: feedback,
      });

      if (res.status === 201) {
        alert("Feedback berhasil dikirim!");
      } else {
        alert("Gagal mengirim feedback.");
      }
    } catch (error) {
      console.error("Error saat mengirim feedback:", error);
      alert("Terjadi kesalahan saat mengirim feedback.");
    } finally {
      setFeedback("");
    }
  };

  const handleSign = async () => {
    if (!selectedContract) return;
    if (!signature) {
      alert("Silakan tanda tangani kontrak terlebih dahulu!");
      return;
    }
    try {
      // 1. Update status kontrak segera
      const response = await axios.put("/api/contract/put", {
        ...selectedContract,
        contractId: selectedContract.id,
        status: "AWAITING_ADMIN_SIGNATURE",
        signature: signature,
      });

      if (!response.data || !response.data.contract) {
        throw new Error("Data kontrak tidak tersedia dalam response.");
      }
      const updatedContract = response.data.contract;

      // 2. Segera tutup dialog, refresh data, tampilkan notifikasi
      setIsSignature(false);
      getContractData();
      alert(
        "Kontrak berhasil ditandatangani! File PDF akan diunggah di background."
      );

      // 3. Upload PDF di background (tidak await)
      (async () => {
        try {
          const data = {
            fullName: updatedContract.fullName,
            address: updatedContract.address,
            contractName: updatedContract.contractName,
            cost: updatedContract.cost,
            startDate: updatedContract.startDate,
            endDate: updatedContract.endDate,
            descriptionContract: updatedContract.descriptionContract,
            features: updatedContract.features,
            scopeOfWork: updatedContract.scopeOfWork,
            signature: signature,
          };
          const blob = await pdf(<ContractPDF data={data} />).toBlob();
          const pdfBuffer = await blob.arrayBuffer();

          const formData = new FormData();
          formData.append("contractId", updatedContract.id);
          formData.append(
            "userId",
            updatedContract.userId || updatedContract.userID
          );
          formData.append(
            "pdfFile",
            new File([pdfBuffer], "contract.pdf", { type: "application/pdf" })
          );

          await axios.put("/api/contract/pdf/put", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // Bisa tambahkan notif/alert sukses upload di background jika mau
        } catch (err) {
          console.error("Gagal upload PDF di background:", err);
          // Bisa tambahkan notif/alert gagal upload jika mau
        }
      })();
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Terjadi kesalahan saat memperbarui kontrak.");
    }
  };

  // const transactionValue = 0.05; // 5% transaction fee
  // const applicationValue = 0.02; // 2% application fee
  // const taxRate = 0.1; // 10% tax

  // const subtotal = calculateSubtotal(products);
  // const transactionFee = calculateTransactionFee(subtotal, transactionValue);
  // const applicationFee = calculateApplicationFee(subtotal, applicationValue);
  // const tax = calculateTax(subtotal, taxRate);
  // const total = calculateTotal(
  //   products,
  //   transactionValue,
  //   applicationValue,
  //   taxRate
  // );

  const handleRejectContract = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Apakah kamu yakin ingin menolak kontrak ini?"
      );
      if (!confirmDelete) return;

      await axios.delete(`/api/contract/delete/${id}`);
      alert("Kontrak berhasil ditolak");
      // Ambil ulang data kontrak setelah delete
      await getContractData();
    } catch (e) {
      console.error("❌ Gagal menolak kontrak:", e);
      alert("Terjadi kesalahan saat menolak kontrak");
    }
  };

  const handleViewProgress = (id: string) => {
    try {
      router.push(`/user/profile/progress/${id}`);
    } catch (error) {
      console.error("Gagal membuka halaman progress:", error);
    }
  };

  return (
    <>
      <Head>
        <title>DBI | User - {String(user.name)}</title>
      </Head>
      <Tabs className="max-w-screen-lg mx-auto pb-8" defaultValue="myProfile">
        <ScrollArea className="w-full max-w-screen-xl lg:pb-0 pb-4 h-fit">
          <TabsList className="w-full">
            <TabsTrigger value="myProfile" className="flex items-center gap-2">
              <CircleUserRound size={20} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <LockKeyholeIcon size={20} />
              Security
            </TabsTrigger>
            <TabsTrigger value="contract" className="flex items-center gap-2">
              <BookCheckIcon size={20} />
              Contract
            </TabsTrigger>
            <TabsTrigger
              value="monitoringProgress"
              className="flex items-center gap-2"
            >
              <ListChecks size={20} />
              Monitoring Progress
            </TabsTrigger>
          </TabsList>
          <Scrollbar orientation="horizontal" />
        </ScrollArea>
        {load ? (
          <div className="w-full h-[50vh] opacity-50 flex justify-center items-center">
            <div className="flex items-center gap-3">
              <LoaderCircle size={28} className="animate-spin" />
              <h1 className="text-xl font-semibold">Loading user ...</h1>
            </div>
          </div>
        ) : (
          <>
            <TabsContent value="myProfile" className="lg:mt-8 md:mt-6 mt-5">
              <div className="flex flex-col w-full gap-5">
                <Card className="w-full">
                  <CardContent className="pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 group">
                        <div className="relative">
                          <img
                            src={user.image}
                            alt="userImage"
                            className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-foreground"
                          />
                          <button className="p-1 absolute"></button>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold capitalize dark:text-white">
                              {user.name}
                            </h2>
                          </div>
                          <p className="text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-5">
                      Personal Information
                    </h3>
                    <Table className="w-fit">
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-gray-500">
                            Name
                          </TableCell>
                          <TableCell className="w-[0px] text-gray-500 font-medium">
                            :
                          </TableCell>
                          <TableCell className="font-medium text-gray-500 flex items-center justify-start gap-2">
                            {isEditing ? (
                              <Input
                                className="capitalize"
                                ref={inputRef}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            ) : (
                              user.name
                            )}
                            {isEditing ? (
                              <>
                                <Button
                                  size={"sm"}
                                  onClick={handleSubmitName}
                                  disabled={nameLoad}
                                >
                                  {nameLoad ? (
                                    <LoaderCircle
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                                <Button
                                  size={"sm"}
                                  variant={"destructive"}
                                  onClick={() => setIsEditing(false)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <button
                                onClick={handleEditClick}
                                className="hover:bg-secondary hover:opacity-80"
                              >
                                <PenSquareIcon size={16} />
                              </button>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-gray-500">
                            Email
                          </TableCell>
                          <TableCell className="w-[0px] text-gray-500 font-medium">
                            :
                          </TableCell>
                          <TableCell className="font-medium text-gray-500 flex items-center justify-start gap-2">
                            {isEditing1 ? (
                              <Input ref={inputRef1} />
                            ) : (
                              user.email
                            )}
                            {isEditing1 ? (
                              <>
                                <Button size={"sm"}>Save</Button>
                                <Button
                                  size={"sm"}
                                  variant={"destructive"}
                                  onClick={() => setIsEditing1(false)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <button
                                onClick={handleEditClick1}
                                className="hover:bg-secondary hover:opacity-80"
                              >
                                <PenSquareIcon size={16} />
                              </button>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-gray-500">
                            Phone
                          </TableCell>
                          <TableCell className="w-[0px] text-gray-500 font-medium">
                            :
                          </TableCell>
                          <TableCell className="font-medium text-gray-500 flex items-center justify-start gap-2">
                            {user.phone ? (
                              user.phone
                            ) : (
                              <Badge variant={"destructive"}>No data</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-gray-500">
                            Email verified
                          </TableCell>
                          <TableCell className="w-[0px] text-gray-500 font-medium">
                            :
                          </TableCell>
                          <TableCell className="font-medium text-gray-500 flex items-center justify-start gap-2">
                            {user.emailVerified ? (
                              <Badge className="flex items-center gap-1 w-fit">
                                Verified <CheckCircleIcon size={14} />{" "}
                              </Badge>
                            ) : (
                              <Badge variant={"destructive"}>
                                Not verified
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-gray-500">
                            Type login
                          </TableCell>
                          <TableCell className="w-[0px] text-gray-500 font-medium">
                            :
                          </TableCell>
                          <TableCell className="font-medium text-gray-500 flex items-center justify-start gap-2 capitalize">
                            {user.type}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="security" className="lg:mt-8 md:mt-6 mt-5">
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 place-items-start w-full">
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-xl pb-3 border-b font-semibold w-full">
                      Password changes
                    </h1>
                    <div className="w-full">
                      <Card className="">
                        <CardContent className="pt-3">
                          <form className="w-full flex flex-col gap-3 items-start">
                            <Input placeholder="your new password here..." />
                            <Input placeholder="confirm your new password here..." />
                            <Button type="submit" size={"sm"}>
                              Confirm
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-xl pb-2 border-b font-semibold w-full">
                      Email verification
                    </h1>
                    <div className="w-full">
                      {user.emailVerified ? (
                        <Card className="bg-primary">
                          <CardContent className="flex flex-col gap-2 items-center pt-3">
                            <Lottie
                              animationData={emailVerified}
                              className="w-1/5"
                            />
                            <h1 className="font-semibold text-primary-foreground">
                              Your email has been verified!
                            </h1>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="">
                          <CardContent className="pt-3">
                            <form className="w-full flex flex-col gap-3 items-start">
                              <Input placeholder="Type your email here..." />
                              <Button type="submit" size={"sm"}>
                                Confirm
                              </Button>
                            </form>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <div className="w-full">
                    <h1 className="text-xl pb-3 border-b font-semibold w-full">
                      Phone verification
                    </h1>
                  </div>
                  <div className="w-full gap-10">
                    <div className="w-full">
                      <Card className="">
                        <CardContent className="pt-3">
                          <form className="w-full flex flex-col gap-3 items-start">
                            <Input placeholder="Type your phone here..." />
                            <Button type="submit" size={"sm"}>
                              Confirm
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="contract"
              className="w-full lg:mt-8 md:mt-6 mt-5"
            >
              <div className="bg-white rounded-lg lg:p-2 p-1 dark:bg-black">
                <h2 className="text-xl pb-3 border-b font-semibold w-full">
                  Contract
                </h2>
                <ScrollArea className="lg:pb-0 pb-4">
                  <Table className="min-w-full divide-y divide-gray-200 mt-4 dark:divide-gray-800">
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900">
                      <TableRow>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Id Contract
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contract
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-950 dark:divide-gray-700">
                      {contractData?.length > 0 ? (
                        contractData.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              {item.id}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              {item.product.name}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              {item.cost ? item.cost : "-"}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              {item.status}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              {item.filename ? (
                                <Button
                                  onClick={() => {
                                    handlePreview(item.filename);
                                    setSelectedContract(item);
                                  }}
                                  className="bg-gray-400 text-black px-2 py-2 rounded-md"
                                >
                                  Preview
                                </Button>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                              {item.status == "AWAITING_CLIENT_SIGNATURE" && (
                                <Button
                                  onClick={() => {
                                    setIsSignature(true);
                                    setSelectedContract(item);
                                  }}
                                >
                                  Sign
                                </Button>
                              )}
                              {item.status === "AWAITING_PAYMENT" && (
                                <Button
                                  onClick={() =>
                                    handleOpenCheckout({
                                      name: item.product.name,
                                      price: item.cost,
                                      image: Array.isArray(item.product.image)
                                        ? item.product.image
                                        : [item.product.image],
                                      variants: item.product.variants || [
                                        "Default Variant",
                                      ],
                                      desc: "Payment for contract " + item.id,
                                      code_product: item.product.code_product,
                                    })
                                  }
                                  className="bg-[#12163F] hover:bg-[#101430] text-white px-4 py-2 rounded-lg"
                                >
                                  Pay
                                </Button>
                              )}
                              {[
                                "PENDING_APPROVAL",
                                "AWAITING_CLIENT_SIGNATURE",
                                "REVISION_REQUESTED",
                                "AWAITING_ADMIN_SIGNATURE",
                                "AWAITING_PAYMENT",
                              ].includes(item.status) && (
                                <Button
                                  onClick={() => handleRejectContract(item.id)}
                                  className="bg-gray-50 text-black px-2 py-2 rounded-md w-fit"
                                >
                                  Cancel
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <p>No Contract</p>
                      )}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="overflow-x-auto shadow-md"></div>
              </div>
              {openCheckout && selectedProduct && (
                <ModalCheckout
                  open={openCheckout}
                  onClose={() => setOpenCheckout(false)}
                  data={selectedProduct}
                />
              )}
            </TabsContent>
            <TabsContent
              value="monitoringProgress"
              className="w-full lg:mt-8 md:mt-6 mt-5"
            >
              <div className="bg-white rounded-lg lg:p-2 p-1 dark:bg-black">
                <h2 className="text-xl pb-3 border-b font-semibold w-full">
                  Monitoring Progress
                </h2>
                <ScrollArea className="lg:pb-0 pb-4">
                  <Table className="min-w-full divide-y divide-gray-200 mt-4 dark:divide-gray-800">
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900">
                      <TableRow>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contract Name
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contract
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-950 dark:divide-gray-700">
                      {contractData.length > 0 &&
                        contractData
                          .filter(
                            (item) =>
                              item.status === "ACTIVE" ||
                              item.status === "COMPLETED"
                          )
                          .map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                {item.contractName}
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                {item.product.name}
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                {item.cost ? item.cost : "-"}
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                {/* {item.filename ? ( */}
                                <Button
                                  onClick={() => handlePreview(item.filename)}
                                  className="bg-gray-400 text-black px-2 py-2 rounded-md"
                                >
                                  Preview
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => handleViewProgress(item.id)}
                                >
                                  View Progress
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="overflow-x-auto shadow-md"></div>
              </div>
            </TabsContent>
            {isSignature && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col">
                  <SignaturePad onSave={(sign) => setSignature(sign)} />
                  <div className="flex justify-end items-center mt-4 gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => setIsSignature(false)}
                    >
                      Close
                    </Button>
                    <Button onClick={handleSign}>
                      Confirm and Accept Contract
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {pdfUrl && isPreviewDialogOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] h-[90%] flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Preview Contract</h2>
                    <Button
                      onClick={() => setIsPreviewDialogOpen(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Close
                    </Button>
                  </div>
                  <iframe src={pdfUrl} className="w-full flex-grow" />
                  {selectedContract?.status == "AWAITING_CLIENT_SIGNATURE" && (
                    <div className="space-y-2">
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">
                          Feedback Pengguna
                        </h3>
                        <textarea
                          className="w-full p-2 border rounded-md mb-2"
                          rows={3}
                          placeholder="Tulis feedback Anda di sini..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <Button onClick={handleSendFeedback}>
                          Kirim Feedback
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </Tabs>
    </>
  );
};

export default ProfilePage;
