"use client";

import { Button } from "@/components/ui/button";
import { ProductDataType } from "@/types/productDataTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Gallery from "@/components/ui/galery";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import formattedPrice from "@/utils/formattedPrice";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shell } from "lucide-react";
import { ContractDataType } from "@/types/contractDataTypes";

type ContractFormData = {
  fullName: string;
  address: string;
  startDate: string;
  endDate: string;
  descriptionContract: string;
  agreement: boolean;
};

const Contractdigital = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status }: any = useSession(); //mengambil data sesi pengguna (login)
  const [product, setProduct] = useState<ProductDataType>(
    {} as ProductDataType
  ); //menyimpan data produk dari api
  const [variant, setVariant] = useState(""); //menyimpan varian produk yang dipilih
  const [load, setLoad] = useState(false); //loading data
  const { toast } = useToast(); //untuk menampilkan notifikasi kepada pengguna
  const [updated] = useState(false); //menandai perubahan sehingga dapat memicu pengambilan ulang data
  const [openAlert, setOpenAlert] = useState(false);
  const [unpaidContracts, setUnpaidContracts] = useState<ContractDataType[]>(
    []
  );
  const [pendingSubmit, setPendingSubmit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      fullName: "",
      address: "",
      startDate: "",
      endDate: "",
      descriptionContract: "",
      agreement: false,
    },
    mode: "onChange",
  });

  const agreement = form.watch("agreement");

  const createContract = async (data: any) => {
    try {
      const response = await axios.post("/api/contract/post/user", {
        userId: session.user?.id,
        productId: product.id,
        ...data,
      });

      if (response.status === 201) {
        toast({
          title: "Sukses!",
          description: "Draft kontrak berhasil disimpan.",
        });
        form.reset();
        router.back();
      } else {
        toast({
          title: "Oops!",
          description: "Terjadi sesuatu yang tidak terduga.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat kontrak.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ContractFormData) => {
    if (
      !Object.values(data).every((value) => value !== "" && value !== false)
    ) {
      toast({ title: "Error", description: "All fields are required!" });
      return;
    }

    try {
      setIsLoading(true);
      const unpaidStatuses = [
        "PENDING_APPROVAL",
        "AWAITING_CLIENT_SIGNATURE",
        "AWAITING_ADMIN_SIGNATURE",
        "AWAITING_PAYMENT",
        "REVISION_REQUESTED",
      ];

      const checkRes = await axios(
        `/api/contract/get?userId=${session.user?.id}`
      );
      const unpaid = checkRes.data.filter((contract: any) =>
        unpaidStatuses.includes(contract.status)
      );

      if (unpaid.length > 0) {
        setUnpaidContracts(unpaid);
        setPendingSubmit(data);
        setOpenAlert(true);
        return;
      }

      await createContract(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat kontrak.",
      });
      setIsLoading(false);
    }
  };

  const handleDeleteContract = async () => {};

  const getData = async () => {
    setLoad(true);
    if (id) {
      try {
        const resp = await axios(`/api/product/get?code=${String(id)}`); //menggunakan axios untuk mengambil data produk berdasarkan id
        setProduct(resp.data);
        setLoad(false); //status setload digunakan untuk menandai data yang sedang diambil
      } catch (error) {
        setLoad(false);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [id, updated]); //memanggil fungsi getdata setiap kali id atau updated berubah

  useEffect(() => {
    if (product.variants) {
      setVariant(product?.variants?.[0]);
    }
  }, [product.variants]); //menyimpan varian pertama produk saat data produk sudah diambil

  return (
    <>
      {product && (
        <div className="flex w-full justify-between lg:flex-row flex-col gap-10">
          <div className="w-full">
            <div className="flex flex-col gap-10 w-full">
              <div className="w-full grid grid-cols-1 gap-8">
                <div className="w-full">
                  <div className="w-full sticky top-24">
                    <Gallery image={product.image && product.image} />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  {load ? (
                    <Skeleton className="w-1/2 h-3" />
                  ) : (
                    <h1 className="text-2xl font-bold capitalize">
                      {product.name}
                    </h1>
                  )}
                  <div className="flex flex-col gap-2">
                    {load ? (
                      <div className="flex flex-col gap-3 w-full">
                        <Skeleton className="w-full h-2" />
                        <Skeleton className="w-full h-2" />
                        <Skeleton className="w-full h-2" />
                        <Skeleton className="w-full h-2" />
                      </div>
                    ) : (
                      <div
                        className="text-sm text-gray-500 font-medium"
                        dangerouslySetInnerHTML={{ __html: product.desc }}
                      />
                    )}
                  </div>
                  {load ? (
                    <Skeleton className="w-3/4 h-5" />
                  ) : (
                    <h1 className="text-3xl font-bold">
                      {formattedPrice.toIDR(product.price)}
                    </h1>
                  )}
                  <h1 className="font-semibold text-sm">
                    (Harga dapat berubah sesuai permintaan)
                  </h1>
                  <Tabs
                    defaultValue="details"
                    className="w-full flex flex-col gap-5 items-start"
                  >
                    <TabsList className="w-full h-fulll">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="specification">
                        Specification
                      </TabsTrigger>
                      <TabsTrigger value="information">Information</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="w-full">
                      <div className="flex flex-col w-full gap-1">
                        <p className="font-semibold text-gray-500 text-sm">
                          Min. Order:{" "}
                          <span className="text-black">{product.minOrder}</span>
                        </p>
                        <p className="font-semibold text-gray-500 text-sm">
                          Category:{" "}
                          <span className="text-black capitalize">
                            {product.category}
                          </span>
                        </p>
                        {load ? (
                          <div className="flex flex-col gap-2 mt-3">
                            <Skeleton className="w-full h-2" />
                            <Skeleton className="w-full h-2" />
                            <Skeleton className="w-full h-2" />
                            <Skeleton className="w-full h-2" />
                            <Skeleton className="w-full h-2" />
                          </div>
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: String(product.details),
                            }}
                            className="text-sm text-gray-500 mt-3"
                          />
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="specification" className="w-full">
                      {load ? (
                        <div className="flex flex-col gap-2 mt-3">
                          <Skeleton className="w-full h-2" />
                          <Skeleton className="w-full h-2" />
                          <Skeleton className="w-full h-2" />
                          <Skeleton className="w-full h-2" />
                          <Skeleton className="w-full h-2" />
                        </div>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: String(product.spec),
                          }}
                          className="text-sm text-gray-500"
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="information" className="w-full">
                      {load ? (
                        <div className="flex flex-col gap-2 mt-3">
                          <Skeleton className="w-full h-2" />
                          <Skeleton className="w-full h-2" />
                          <Skeleton className="w-full h-2" />
                          <Skeleton className="w-full h-2" />
                          <Skeleton className="w-full h-2" />
                        </div>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: String(product.information),
                          }}
                          className="text-sm text-gray-500"
                        />
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-white p-6 shadow rounded-lg">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <h2 className="text-xl font-bold my-4">Personal Info</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      name: "fullName",
                      label: "Full Name",
                      type: "text",
                      className: "col-span-2",
                    },
                    {
                      name: "address",
                      label: "Address",
                      type: "text",
                      className: "col-span-2",
                    },
                  ].map(({ name, label, type, className }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as "fullName" | "address"}
                      render={({ field }) => (
                        <FormItem className={className}>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={label}
                              type={type}
                              {...field}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <h2 className="text-xl font-bold my-4">Contract Info</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "startDate", label: "Start Date", type: "date" },
                    { name: "endDate", label: "End Date", type: "date" },
                  ].map(({ name, label, type }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as "startDate" | "endDate"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={label}
                              type={type}
                              {...field}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormField
                    control={form.control}
                    name="descriptionContract"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Description Contract</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description Contract"
                            {...field}
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <FormField
                    control={form.control}
                    name="agreement"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            required
                          />
                        </FormControl>
                        <span>Agree</span>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !agreement}
                  className="w-full flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Shell
                        size={24}
                        strokeWidth={2}
                        className="animate-spin"
                      />
                      Loading...
                    </>
                  ) : (
                    "Create an account!"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogContent className="w-fit">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to proceed with this digital contract?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  By confirming, this contract will be officially created and
                  recorded.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className=""
                  onClick={() => setOpenAlert(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    // Hapus kontrak-kontrak lama
                    await Promise.all(
                      unpaidContracts.map((contract: any) =>
                        axios.delete(`/api/contract/delete/${contract.id}`)
                      )
                    );
                    setOpenAlert(false);
                    if (pendingSubmit) {
                      await createContract(pendingSubmit);
                      setPendingSubmit(null);
                    }
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
};
export default Contractdigital;
