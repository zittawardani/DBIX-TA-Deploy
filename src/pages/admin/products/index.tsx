import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductDataType } from "@/types/productDataTypes";
import axios from "axios";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import formattedPrice from "@/utils/formattedPrice";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import Head from "next/head";
import { Eye, FolderPlusIcon, PenBox, Trash } from "lucide-react";
import ModalZoomImage from "@/components/ui/modals/zoomImage";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteDialog from "@/components/ui/deleteModal";

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductDataType[]>([]);
  const [load, setLoad] = useState(true);
  const [modalDeleteView, setModalDeleteView] = useState(false);
  const [updated, setUpdated] = useState(false);

  const getProductsData = async () => {
    try {
      const resp = await axios("/api/product/get/all");
      setProducts(resp.data);
      setLoad(false);
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getProductsData();
  }, [updated]);

  const handleDelete = async (id: string | undefined) => {
    setLoad(true);
    try {
      await axios.delete(`/api/product/delete/${id}`);
      setLoad(false);
      setModalDeleteView(false);
      setUpdated(!updated);
    } catch (error) {
      alert("error");
      console.log(error);
    }
  };

  const renderSkeletonRows = (numRows: number) => {
    return Array.from({ length: numRows }).map((_, index) => (
      <TableRow key={index}>
        <TableCell className="px-6 py-2 whitespace-nowrap">
          <Skeleton className="w-full h-6" />
        </TableCell>
        <TableCell className="px-6 py-2 whitespace-nowrap">
          <Skeleton className="w-full h-6" />
        </TableCell>
        <TableCell className="px-6 py-2 whitespace-nowrap">
          <Skeleton className="w-full h-6" />
        </TableCell>
        <TableCell className="px-6 py-2 whitespace-nowrap">
          <Skeleton className="w-full h-6" />
        </TableCell>
        <TableCell className="px-6 py-2 whitespace-nowrap">
          <Skeleton className="w-full h-6" />
        </TableCell>
        <TableCell className="px-6 py-2 whitespace-nowrap">
          <Skeleton className="w-full h-6" />
        </TableCell>
        <TableCell className="px-6 py-2 whitespace-nowrap">
          <Skeleton className="w-full h-6" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <Head>
        <title>DBI | Admin - products</title>
      </Head>
      <div className="w-full lg:p-4 p-1 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Products</h1>
            <Link href={"/admin/products/add"}>
              <Button
                className="text-white flex items-center gap-2 dark:bg-black"
                size={"sm"}
              >
                <FolderPlusIcon size={16} />
                Add
              </Button>
            </Link>
          </div>
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
                <BreadcrumbPage className="font-semibold">
                  Products
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ScrollArea className="lg:pb-0 pb-4">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableCaption>A list of products</TableCaption>
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code product
                </TableHead>
                <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </TableHead>
                <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </TableHead>
                <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </TableHead>
                <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-950">
              {load
                ? renderSkeletonRows(5)
                : products.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-6 py-2 whitespace-nowrap">
                        {item.code_product}
                      </TableCell>
                      <TableCell className="px-6 py-2 whitespace-nowrap">
                        {item.name}
                      </TableCell>
                      <TableCell className="px-6 py-2 whitespace-nowrap">
                        {formattedPrice.toIDR(item.price)}
                      </TableCell>
                      <TableCell className="px-6 py-2 whitespace-nowrap capitalize">
                        {item.category}
                      </TableCell>
                      <TableCell
                        className="px-6 flex items-center gap-2 py-2 whitespace-nowrap"
                        title="Zoom"
                      >
                        <ModalZoomImage src={item.image[0]} alt={item.name} />
                      </TableCell>
                      <TableCell className="px-6 py-2">
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Link
                                  href={`/admin/products/details/${item.code_product}`}
                                >
                                  <Button variant={"secondary"} size={"sm"}>
                                    <Eye />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent className="bg-foreground text-background p-3 rounded-md">
                                <p>Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Link
                                  href={`/admin/products/edit/${item.code_product}`}
                                >
                                  <Button variant={"secondary"} size={"sm"}>
                                    <PenBox />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent className="bg-foreground text-background p-3 rounded-md">
                                <p>Update</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <DeleteDialog
                                  onDelete={() => handleDelete(item.id)}
                                  load={load}
                                  modalDeleteView={modalDeleteView}
                                  setModalDeleteView={setModalDeleteView}
                                />
                              </TooltipTrigger>
                              <TooltipContent className="bg-foreground text-background p-3 rounded-md">
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default ProductsPage;
