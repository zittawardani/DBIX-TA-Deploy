import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardProduct from "@/components/ui/cardProducts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { ProductDataType } from "@/types/productDataTypes";
import axios from "axios";
import SkeletonGrid from "@/components/ui/skeletonGrid";
import Lottie from "lottie-react";
import upcommingAnimation from '../../../../public/animations/upcomming.json'

const BestProducts = () => {
  const categoryView = [
    "Website",
    "Web 3",
    "Android Application",
    "IOS Application",
    "Blockchain Service",
    "Bussiness Platform",
    "Gaming Exchange Based Token",
    "Payment Gateway",
    "Decentralized Exchange",
    "IOT",
    "Create Robot Trading",
    "Exchanger Platform",
    "Android Exchange",
    "IOS Exchange",
    "NFT Platform",
    "(COIN) - Sha 256",
    "(TOKEN) - ERC 20, BSC 20, TRC 20",
  ]
  const [productsData, setProductsData] = useState<ProductDataType[]>([])
  const [category, setCategory] = useState('website')
  const [load, setLoad] = useState(false)

  const getData = async () => {
    setLoad(true)
    try {
      const resp = await axios(`/api/product/get/categories?name=${category}`)
      setProductsData(resp.data)
      setTimeout(() => {
        // setLoad(false)
      }, 1000)
      setLoad(false)
    } catch (error) {
      setLoad(false)
      console.log(error)
    }
  }
  useEffect(() => {
    getData()
  }, [category])

  return (
    <div className="w-full flex flex-col gap-8 lg:mt-5" id="products">
      <div className="flex flex-col gap-3 items-center">
        <h1 className="text-2xl lg:text-5xl capitalize text-center font-semibold">
          Products
          <p className="text-sm text-[#455A64] mt-3">There are numbers of reasons</p>
        </h1>
      </div>
      <div className="w-full">
        <Tabs defaultValue={categoryView[0]} className="w-full flex flex-col gap-5 lg:justify-center items-center h-fit">
          <ScrollArea className="w-full max-w-screen-xl pb-4 h-fit">
            <TabsList className="w-full">
              {categoryView.map(item => (
                <TabsTrigger key={item} value={item} onClick={() => setCategory(item.toLowerCase())}>
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {categoryView.map((item, index) => (
            <TabsContent key={index} value={item} className="w-full">
              {load ? (
                <div className="w-full grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-5">
                  <SkeletonGrid length={10} />
                </div>
              ) : (
                <div className="w-full flex flex-col gap-8 items-center justify-center">
                  {productsData.length > 0 ? (
                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-5 w-full">
                      {productsData.map((item, index) => (
                        <CardProduct data={item} key={index} />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="max-w-xl mx-auto w-full">
                        <Lottie animationData={upcommingAnimation} size={16} />
                        <h1 className="text-center font-medium text-xl italic leading-snug">Sorry the products is incomming as soon as posible 😊 <br /> <span className="font-normal text-sm">Please stay tune on this website to see our new products 🚀</span></h1>
                      </div>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default BestProducts;
