import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import Galery from "@/components/ui/galery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ProductDetails = {
  id: string;
  name: string;
  price: number;
  desc: string;
  image: string[];
  sold: number;
  rate: number;
  review_count: number;
  variants: string[];
};

const ProductDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<ProductDetails | null>(null);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await axios.get(`/api/product/get?code=${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (id) {
      getProductDetails();
    }
  }, [id]);

  if (!product) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center gap-3">
        <LoaderCircle size={32} className="animate-spin"/>
        Loading data...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Products</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">DBI</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/products/details/${id}`}>
                Details
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-4">
        <Card className="w-full lg:w-2/3 shadow-lg">
          <CardContent className="flex">
            <div className="w-1/2">
              <Galery image={product.image} />
            </div>

            <div className="w-2/3 pl-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.desc}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 flex items-center">
                  <StarIcon className="w-4 h-4" /> {product.rate} (
                  {product.review_count}+ ratings)
                </span>
                <span className="ml-4 text-gray-500">Sold {product.sold}+</span>
                <span className="ml-4 text-blue-500 cursor-pointer">
                  Discuss
                </span>
              </div>
              <p className="text-xl font-bold mt-4">
                RP. {product.price.toFixed(2)}
              </p>
              <div className="mt-4">
                <label className="block mb-2">Choose Variants:</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant, index) => (
                      <SelectItem key={index} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full lg:w-1/3 space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Item Detail</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Details:</p>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </li>
                <li>
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </li>
                <li>Information on usage and features.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Top Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <h4 className="font-semibold">Nafis Design</h4>
                  <p className="text-gray-500 text-sm">
                    UI Designer | UX designer course
                  </p>
                  <p className="text-yellow-500 flex items-center mt-1">
                    <StarIcon className="w-4 h-4" /> 5.0
                  </p>
                  <p className="mt-2 text-gray-600">
                    Nullam donec dolor justo est pharetra accusam eget neque. Et
                    fusce maecenas sagittis enim.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-semibold">Kaesang</p>
              <p className="text-sm text-gray-500">40 menit lalu</p>
              <p className="mt-2">Kak bisa tukar product ?</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-semibold">Admin DBIX - Ramz</p>
              <p className="text-sm text-gray-500">40 menit lalu</p>
              <p className="mt-2">Lorem ipsummmmm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
