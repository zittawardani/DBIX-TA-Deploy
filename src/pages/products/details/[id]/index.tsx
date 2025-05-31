import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ProductDataType } from "@/types/productDataTypes";
import {
  MinusIcon,
  Pencil2Icon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { TabsContent } from "@radix-ui/react-tabs";
import Gallery from "@/components/ui/galery";
import Head from "next/head";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { PenBoxIcon, Trash2Icon } from "lucide-react";
import { ItemDataType } from "@/types/itemsDataTypes";
import formattedPrice from "@/utils/formattedPrice";
import { useProductStore } from "@/store/product";

const Details = ({
  //komponen menerima 2 properti
  items, // array yang menyimpan daftar item dalam keranjang
}: {
  items: ItemDataType[];
  setItems: Dispatch<SetStateAction<ItemDataType[]>>; //menggunakan tipe data TypeScript
}) => {
  const { id } = useRouter().query; //deklarasi state, mengambil parameter id dari url menggunakan userouter untuk menentukan produk yg sedang dilihat
  const [product, setProduct] = useState<ProductDataType>(
    {} as ProductDataType
  ); //menyimpan data produk dari api
  const [variant, setVariant] = useState(""); //menyimpan varian produk yang dipilih
  const [qty, setQty] = useState(1); //mengelola jumlah produk yg ingin ditambahkan ke keranjang, default 1
  const [load, setLoad] = useState(false); //loading data
  const [updated, setUpdated] = useState(false); //menandai perubahan sehingga dapat memicu pengambilan ulang data

  const router = useRouter();
  const { updateProduct } = useProductStore();

  const handleQtyPlus = () => {
    setQty(qty + 1); //meningkatkan atau mengurangi jumlah produk
  };
  const handleQtyMinus = () => {
    setQty(qty - 1); //memastikan kuantitas tidak kurang dari 1
    if (qty <= 1) {
      setQty(1);
    }
  };

  const handleAddDiscuss = () => {
    const updatedProduct = { ...product, variant: variant };
    updateProduct(updatedProduct);
    router.push("/discuss");
  }; //buka/tutup tampilan diskusi

  const handleCreateContract = () => {
    router.push(`/contractdigital/${id}`);
  };

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

  const calculateSubtotal = (price: number) => {
    return price * qty; //menghitung subtotal harga berdasarkan harga per unit dikalikan jumlah produk
  };

  return (
    <>
      <Head>
        <title>DBI - Item Details</title>
      </Head>
      {product && (
        <div className="flex w-full justify-between lg:flex-row flex-col gap-10">
          <div className="lg:w-[70%] w-full">
            <div className="flex flex-col gap-10 w-full">
              <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-8">
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
                  <h1 className="font-semibold text-sm">(Harga dapat berubah sesuai permintaan)</h1>
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

              <div className="flex flex-col gap-5 w-full">
                <h1 className="text-4xl font-semibold">Discussion</h1>
                <hr />
                <Button onClick={handleAddDiscuss} size={"sm"} className="mt-2">
                  Add discussion
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:w-[30%] w-full sticky top-24 h-full">
            <div className="w-full">
              <Card className="flex flex-col">
                <CardHeader className="font-bold text-lg">
                  Set Amount
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="border rounded-md flex justify-between items-center gap-1">
                      <Button
                        disabled={items.some(
                          (item) => item.code_product === String(id)
                        )}
                        onClick={handleQtyMinus}
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <MinusIcon />
                      </Button>
                      <p
                        className={`font-medium ${
                          items.some((item) => item.code_product === String(id))
                            ? "text-muted-foreground"
                            : ""
                        }`}
                      >
                        {qty}
                      </p>
                      <Button
                        disabled={items.some(
                          (item) => item.code_product === String(id)
                        )}
                        onClick={handleQtyPlus}
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                    <p className="font-medium capitalize flex items-center gap-1 justify-center ">
                      remaining stock :{" "}
                      <span
                        className={`${
                          product.stock && product.stock >= 99
                            ? "underline"
                            : ""
                        }`}
                      >
                        {product.stock && product?.stock >= 99
                          ? "Unlimited"
                          : product.stock}
                      </span>{" "}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <h1 className="text-gray-500 font-medium">Subtotal</h1>
                    <h1 className="font-medium">
                      {formattedPrice.toIDR(calculateSubtotal(product.price))}
                    </h1>
                  </div>
                  <div className="mt-5 w-full flex flex-col gap-3">
                    <Button onClick={handleCreateContract}>
                      Create Contract
                    </Button>
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Details;
