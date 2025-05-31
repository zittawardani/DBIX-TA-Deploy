// File: src/pages/admin/order/index.tsx
import React, { useEffect, useState, useRef } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import OrderDataTypes from "@/types/orderDataTypes";
import axios from "axios";
import { FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}

const OrderTable: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [orders, setOrders] = useState<OrderDataTypes[]>([]);
  const exportRef = useRef<HTMLDivElement>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const handleDateClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleExportInvoicePDF = () => {
    const doc = new jsPDF("portrait", "pt", "A4");
    let currentY = 40;

    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo di kanan atas
    const logoSize = 40;
    const logoX = pageWidth - logoSize - 40; // 40 padding kanan
    const logoY = currentY;
    const logoUrl = "/logo.png"; // pastikan path ini sesuai di public/

    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      doc.addImage(img, "PNG", logoX, logoY, logoSize, logoSize);

      // Teks rata kiri di samping logo
      doc.setFontSize(15);
      doc.text("E-Shop DBI - Digital Blockchain Indonesia", 40, currentY + 10);
      doc.setFontSize(10);
      doc.text(
        "Jl. Sutawijaya No.89, Sumberrejo, Kec. Banyuwangi,\nKabupaten Banyuwangi, Jawa Timur 68419",
        40,
        currentY + 25
      );

      currentY += 60;

      orders.forEach((order, idx) => {
        // Judul invoice
        doc.setFontSize(12);
        doc.text(`Order #${idx + 1}`, 40, currentY);
        currentY += 15;
        doc.setFontSize(10);
        doc.text(`Order ID: ${order.orderId}`, 40, currentY);
        currentY += 12;
        doc.text(`User ID: ${order.userId}`, 40, currentY);
        currentY += 12;
        doc.text(`Status: ${order.status}`, 40, currentY);
        currentY += 12;
        doc.text(
          `Order Date: ${new Date(order.orderDate).toLocaleDateString()}`,
          40,
          currentY
        );
        currentY += 12;
        doc.text(`Payment Method: ${order.paymentMethods}`, 40, currentY);
        currentY += 10;

        const tableRows: any[] = [];
        order.products?.forEach((product: any) => {
          tableRows.push([
            product.id,
            `Rp ${product.price?.toLocaleString() ?? "-"}`,
            product.qty ?? 1,
          ]);
        });

        autoTable(doc, {
          startY: currentY + 10,
          head: [["Product ID", "Price", "Qty"]],
          body: tableRows,
          margin: { left: 40 },
          styles: { fontSize: 9 },
          theme: "grid",
        });

        currentY = doc.lastAutoTable?.finalY
          ? doc.lastAutoTable.finalY + 20
          : currentY + 60;

        // Garis pemisah
        doc.setDrawColor(180);
        doc.line(40, currentY, pageWidth - 40, currentY);
        currentY += 20;
      });

      doc.save("AllOrders-Invoice.pdf");
    };
  };

  const getOrderData = async () => {
    try {
      const resp = await axios("/api/order/get");
      if (resp.status === 200) {
        setOrders(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderData();
  }, []);

 const handleAccept = async (id: string) => {
  try {
    const res = await axios.put(`/api/order/put?id=${id}`, {
      status: "Success", 
    });

    if (res.status === 200) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "Success" } : order
        )
      );
    }
  } catch (error) {
    console.error("Failed to update status", error);
  }
};


  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Order</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">DBIX</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Order</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Filter section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-white p-4 rounded-lg shadow mb-4 dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger>
              <button
                onClick={handleDateClick}
                className="bg-white text-gray-600 px-4 py-2 rounded-lg dark:bg-gray-950 dark:text-white"
              >
                Date
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 dark:bg-gray-950 dark:text-white">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-lg dark:bg-gray-950 dark:text-white">
                Order Status
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Pending</DropdownMenuItem>
              <DropdownMenuItem>Success</DropdownMenuItem>
              <DropdownMenuItem>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <button
          onClick={handleExportInvoicePDF}
          className="bg-[#12163F] hover:bg-[#101430] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export to PDF</span>
        </button>
      </div>

      {/* Table section */}
      <div ref={exportRef}>
        <div className="bg-white shadow rounded-lg p-4 dark:bg-black">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">
            Recent Orders
          </h2>
          <div className="overflow-auto">
            <Table className="min-w-full divide-y divide-gray-200 text-sm">
              <TableHeader className="bg-gray-50 dark:bg-gray-900">
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User Id</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Payment Proof</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-950">
                {orders.map((order, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.products[0]?.id ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Success"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {order.paymentMethods}
                    </TableCell>
                    <TableCell>
                      {order.paymentProof ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <img
                              src={order.paymentProof}
                              alt="proof"
                              className="w-16 h-auto cursor-pointer rounded-md hover:opacity-80"
                              onClick={() =>
                                setSelectedProof(order.paymentProof)
                              }
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl w-full">
                            <img
                              src={selectedProof ?? ""}
                              alt="Payment Proof"
                              className="w-full h-auto p-0 rounded-none sm:rounded sm:p-6"
                            />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {order.status === "Success" ? (
                        <button
                          disabled
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                        >
                          ✔ Verified
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAccept(order.id)}
                          className="bg-[#12163F] hover:bg-[#101430] text-white px-3 py-1 rounded text-xs"
                        >
                          Accept
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
