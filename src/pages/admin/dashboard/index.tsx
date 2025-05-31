import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Head from "next/head";
import OrderDataTypes from "@/types/orderDataTypes";
import axios from "axios";



const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderDataTypes[]>([])

  const getOrderData = async () => {
    try {
      const resp = await axios('/api/order/get')
      if (resp.status === 200) {
        setOrders(resp.data)
      }
      console.log(resp)
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  useEffect(() => {
    getOrderData()
  }, [])
  return (
    <>
      <Head>
        <title>DBI | Admin - dashboard</title>
      </Head>
      <div className="lg:p-4 p-1 space-y-6">
        <div className="space-y-3">
          <h2 className="font-bold text-4xl">Dashboard</h2>
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
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg lg:p-4 p-1 dark:bg-black">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-w">Recent Orders</h2>
          <ScrollArea className="lg:pb-0 pb-4">
            <Table className="min-w-full divide-y divide-gray-200 mt-4 dark:divide-gray-700">
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader className="bg-gray-50 dark:bg-gray-900">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Id
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Id
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Proof
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-950">
                {orders && orders.length > 0 && orders.map((order, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {order.orderId}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {order.products[0].id}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "process"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >{order.status}</span>

                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {order.userId}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 capitalize py-4 whitespace-nowrap">
                      {order.paymentMethods}
                    </TableCell>
                    <TableCell className="px-6 capitalize py-4 whitespace-nowrap">
                      {order.paymentProof === '' ? '-' : (
                        <img src={order.paymentProof} alt="" />
                      )}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="overflow-x-auto shadow-md"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
